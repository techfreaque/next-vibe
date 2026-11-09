/**
 * Finance Repository
 * Server-only. Read-only ingest of real revenue (Stripe, NOWPayments) and
 * real upstream balances / spend (inference providers), daily margin rollup,
 * anomaly alerts (mail + error log, deduplicated), status and thresholds.
 *
 * All external access goes through FinanceDeps so tests mock it: nothing here
 * calls a live API unless the default deps are used.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditTransactions } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { systemMailboxEnv } from "@/messenger/system-mailbox/env";
import { SystemMailboxRepository } from "@/messenger/system-mailbox/repository";
import { scopedTranslation as mailScopedTranslation } from "@/messenger/system-mailbox/i18n";
import { PaymentProvider } from "@/payment/enum";
import { paymentEnv } from "@/payment/env";
import { agentEnv } from "@/vibe/agent/env";

import { FINANCE_CONFIG } from "./config";
import {
  financeAlerts,
  financeDailyRollups,
  financeProviderSnapshots,
  financeRevenueEvents,
  financeRevenueSnapshots,
  financeSourceStatus,
  financeThresholds,
} from "./db";
import {
  CostCoverage,
  type CostCoverageValue,
  FinanceAlertType,
  FinanceSource,
  type FinanceSourceValue,
  IngestScope,
  type IngestScopeValue,
  ProviderSources,
  RevenueEventKind,
  RevenueSources,
  SourceRunStatus,
  ThresholdKey,
} from "./enum";
import type { FinanceT } from "./i18n";
import type { FinanceIngestResponseOutput } from "./ingest/definition";
import {
  type AlertCandidate,
  classifyCostCoverage,
  computeMargin,
  dayKey,
  DEFAULT_THRESHOLDS,
  detectDayAnomalies,
  detectProviderAnomalies,
  isDuplicateAlert,
  resolveThresholds,
  round2,
  spendBetween,
  startOfUtcDay,
  startOfUtcHour,
  THRESHOLD_FIELD,
  type Thresholds,
} from "./logic";
import { type FinanceHttp, liveHttp } from "./sources/http";
import { PROVIDER_ADAPTERS, providerLabel } from "./sources/providers";
import {
  createNowPaymentsPort,
  createStripePort,
  type NowPaymentsPort,
  pullLocalPaymentLedger,
  pullNowPayments,
  pullStripe,
  reconcileWithLocalSales,
  type RevenuePull,
  type StripeLedgerPort,
} from "./sources/revenue";
import type { RevenueEventInput } from "./sources/types";
import type { FinanceStatusResponseOutput } from "./status/definition";
import type {
  FinanceThresholdSetRequestOutput,
  FinanceThresholdSetResponseOutput,
} from "./thresholds/definition";

// ─── Deps (replaceable in tests) ─────────────────────────────────────────────

export interface MailOutcome {
  ok: boolean;
  detail: string;
}

export interface FinanceDeps {
  http: FinanceHttp;
  now(): Date;
  apiKey(source: typeof FinanceSourceValue): string | undefined;
  stripePort(): StripeLedgerPort | null;
  nowPaymentsPort(http: FinanceHttp): NowPaymentsPort | null;
  /** Finance-alert recipients (ops inbox + Thea mailbox); empty when none resolve. */
  recipients(): string[];
  sendMail(
    input: { to: string; subject: string; text: string },
    userId: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<MailOutcome>;
}

const nonEmpty = (value: string | undefined): string | undefined =>
  value && value.trim() !== "" ? value.trim() : undefined;

export const defaultFinanceDeps: FinanceDeps = {
  http: liveHttp,
  now: () => new Date(),
  apiKey(source) {
    switch (source) {
      case FinanceSource.OPENROUTER:
        return nonEmpty(agentEnv.OPENROUTER_API_KEY);
      case FinanceSource.NANO_GPT:
        return nonEmpty(agentEnv.NANO_GPT_API_KEY);
      case FinanceSource.VENICE:
        return nonEmpty(agentEnv.VENICE_AI_API_KEY);
      case FinanceSource.UNCENSORED_AI:
        return nonEmpty(agentEnv.UNCENSORED_AI_API_KEY);
      case FinanceSource.GAB:
        return nonEmpty(agentEnv.GAB_AI_API_KEY);
      case FinanceSource.FREEDOM_GPT:
        return nonEmpty(agentEnv.FREEDOMGPT_API_KEY);
      case FinanceSource.STRIPE:
        return nonEmpty(paymentEnv.STRIPE_SECRET_KEY);
      case FinanceSource.NOWPAYMENTS:
        return nonEmpty(paymentEnv.NOWPAYMENTS_API_KEY);
      default:
        return undefined;
    }
  },
  stripePort: () => createStripePort(),
  nowPaymentsPort: (http) => createNowPaymentsPort(http),
  recipients() {
    // Ops inbox + the Thea mailbox, deduped. Deliberately NOT
    // THEA_MAIL_REPORT_TO: that is the founder's personal address for the daily
    // status report, and finance alerts must not land there.
    const list = [
      FINANCE_CONFIG.alertInbox,
      nonEmpty(systemMailboxEnv.THEA_MAIL_ADDRESS),
    ].filter((v): v is string => v !== undefined && v.trim() !== "");
    return [...new Set(list.map((v) => v.trim()))];
  },
  async sendMail(input, userId, logger, locale) {
    const { t } = mailScopedTranslation.scopedT(locale);
    const result = await SystemMailboxRepository.send(input, userId, logger, t);
    return result.success
      ? { ok: true, detail: "sent" }
      : { ok: false, detail: result.message };
  },
};

// ─── Internal shapes ─────────────────────────────────────────────────────────

type SourceReport = FinanceIngestResponseOutput["sources"][number];
type DayReport = FinanceIngestResponseOutput["days"][number];
type AlertReport = FinanceIngestResponseOutput["alerts"][number];

/** One recomputed day plus the pieces anomaly detection and the report need. */
interface DayComputation {
  report: DayReport;
  revenue: DayRevenue;
  upstreamCostUsd: number | null;
  internalBilledUsd: number;
  coverage: typeof CostCoverageValue;
}

interface DayRevenue {
  grossUsd: number;
  refundsUsd: number;
  disputesUsd: number;
  refundCount: number;
  disputeCount: number;
  paymentCount: number;
  cancellationCount: number;
  payoutsUsd: number;
}

const emptyDay = (): DayRevenue => ({
  grossUsd: 0,
  refundsUsd: 0,
  disputesUsd: 0,
  refundCount: 0,
  disputeCount: 0,
  paymentCount: 0,
  cancellationCount: 0,
  payoutsUsd: 0,
});

/** Aggregate raw revenue rows into per source per UTC day totals. */
export function aggregateEvents(
  events: readonly RevenueEventInput[],
): Map<string, Map<string, DayRevenue>> {
  const bySource = new Map<string, Map<string, DayRevenue>>();
  for (const ev of events) {
    const days = bySource.get(ev.source) ?? new Map<string, DayRevenue>();
    bySource.set(ev.source, days);
    const key = dayKey(ev.occurredAt);
    const day = days.get(key) ?? emptyDay();
    days.set(key, day);
    switch (ev.kind) {
      case RevenueEventKind.CHARGE:
        day.grossUsd += ev.amountUsd;
        day.paymentCount += 1;
        break;
      case RevenueEventKind.REFUND:
        day.refundsUsd += ev.amountUsd;
        day.refundCount += 1;
        break;
      case RevenueEventKind.DISPUTE:
        day.disputesUsd += ev.amountUsd;
        day.disputeCount += 1;
        break;
      case RevenueEventKind.CANCELLATION:
        day.cancellationCount += 1;
        break;
      case RevenueEventKind.PAYOUT:
        day.payoutsUsd += ev.amountUsd;
        break;
      default:
        break;
    }
  }
  return bySource;
}

const DAY_MS = FINANCE_CONFIG.dayMs;

export class FinanceRepository {
  /** Replaceable in tests. */
  static deps: FinanceDeps = defaultFinanceDeps;

  // ─── Thresholds ────────────────────────────────────────────────────────────

  static async loadThresholds(): Promise<Thresholds> {
    const rows = await db.select().from(financeThresholds);
    return resolveThresholds(rows);
  }

  static async setThreshold(
    data: FinanceThresholdSetRequestOutput,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FinanceThresholdSetResponseOutput>> {
    try {
      if (!Number.isFinite(data.value) || data.value < 0) {
        return fail({
          message: t("errors.invalidThreshold"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const note = data.note?.trim() ? data.note.trim() : null;
      await db
        .insert(financeThresholds)
        .values({
          key: data.key,
          value: data.value,
          enabled: data.enabled,
          note,
        })
        .onConflictDoUpdate({
          target: financeThresholds.key,
          set: {
            value: data.value,
            enabled: data.enabled,
            note,
            updatedAt: new Date(),
          },
        });
      return success({ savedKey: data.key });
    } catch (error) {
      logger.error("[Finance] Threshold save failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Ingest ────────────────────────────────────────────────────────────────

  static async ingest(
    data: {
      scope: typeof IngestScopeValue;
      dryRun: boolean;
      windowDays?: number;
      backfillFrom?: string;
      backfillTo?: string;
    },
    userId: string | undefined,
    logger: EndpointLogger,
    t: FinanceT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FinanceIngestResponseOutput>> {
    const deps = FinanceRepository.deps;
    try {
      const now = deps.now();

      // Backfill mode: recompute the daily rollups over a historical range from
      // the complete source ledgers (payments + credits + whatever cost
      // snapshots exist). Reuses the same rollup logic as the live path; raises
      // no alerts (historical) and always writes (dry-run does not apply).
      if (data.backfillFrom !== undefined && data.backfillFrom.trim() !== "") {
        return FinanceRepository.runBackfill(data, now, t, logger);
      }

      const thresholds = await FinanceRepository.loadThresholds();
      const candidates: AlertCandidate[] = [];
      const sources: SourceReport[] = [];
      /** USD spend measured by THIS run, keyed by provider (dry runs persist nothing). */
      const runSpend = new Map<string, number>();
      /** Revenue pulled by THIS run (used for dry-run rollups). */
      const pulled: RevenueEventInput[] = [];

      if (data.scope !== IngestScope.REVENUE) {
        for (const provider of ProviderSources) {
          const report = await FinanceRepository.ingestProvider(
            provider,
            now,
            data.dryRun,
            thresholds,
            candidates,
            runSpend,
            logger,
          );
          sources.push(report);
        }
      }

      if (data.scope !== IngestScope.BALANCES) {
        const windowDays = data.windowDays ?? FINANCE_CONFIG.revenueWindowDays;
        const since = new Date(
          startOfUtcDay(now).getTime() - windowDays * DAY_MS,
        );
        for (const source of RevenueSources) {
          const report = await FinanceRepository.ingestRevenue(
            source,
            since,
            data.dryRun,
            pulled,
            logger,
          );
          sources.push(report);
        }
      }

      const days = await FinanceRepository.rollup(
        now,
        data,
        pulled,
        runSpend,
        thresholds,
        candidates,
        logger,
      );

      if (!data.dryRun) {
        for (const report of sources) {
          await FinanceRepository.recordSourceStatus(report, now);
        }
      }

      const raised = await FinanceRepository.raiseAlerts(
        candidates,
        thresholds,
        data.dryRun,
        now,
        userId,
        logger,
        locale,
      );

      return success({
        ranAt: now.toISOString(),
        dryRunResult: data.dryRun,
        sources,
        days,
        alertsRaised: raised.filter((a) => a.delivery !== "suppressed").length,
        alertsSuppressed: raised.filter((a) => a.delivery === "suppressed")
          .length,
        alerts: raised,
      });
    } catch (error) {
      logger.error("[Finance] Ingest failed", parseError(error));
      return fail({
        message: t("errors.ingestFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Provider balances ─────────────────────────────────────────────────────

  private static async ingestProvider(
    provider: (typeof ProviderSources)[number],
    now: Date,
    dryRun: boolean,
    thresholds: Thresholds,
    candidates: AlertCandidate[],
    runSpend: Map<string, number>,
    logger: EndpointLogger,
  ): Promise<SourceReport> {
    const deps = FinanceRepository.deps;
    const base: SourceReport = {
      source: provider,
      kind: "provider",
      status: SourceRunStatus.SKIPPED,
      reason: null,
      balanceUsd: null,
      spendUsd: null,
      events: 0,
    };
    const adapter = PROVIDER_ADAPTERS.find((a) => a.source === provider);
    if (!adapter || adapter.endpoint === null) {
      return {
        ...base,
        reason: adapter?.noEndpointReason ?? "no adapter for this provider",
      };
    }
    const apiKey = deps.apiKey(provider);
    if (!apiKey) {
      return { ...base, reason: "no API key configured" };
    }
    try {
      const result = await adapter.fetchBalance(deps.http, apiKey);
      if (result.status !== "ok") {
        return {
          ...base,
          status:
            result.status === "failed"
              ? SourceRunStatus.FAILED
              : SourceRunStatus.SKIPPED,
          reason: result.reason,
        };
      }

      const bucketAt = startOfUtcHour(now);
      const [previous] = await db
        .select()
        .from(financeProviderSnapshots)
        .where(
          and(
            eq(financeProviderSnapshots.provider, provider),
            lt(financeProviderSnapshots.bucketAt, bucketAt),
          ),
        )
        .orderBy(desc(financeProviderSnapshots.bucketAt))
        .limit(1);

      const delta = previous
        ? spendBetween(
            {
              balanceUsd: previous.balanceUsd,
              cumulativeUsageUsd: previous.cumulativeUsageUsd,
              at: previous.capturedAt,
            },
            {
              balanceUsd: result.balanceUsd,
              cumulativeUsageUsd: result.cumulativeUsageUsd,
              at: now,
            },
          )
        : null;

      if (delta) {
        runSpend.set(provider, delta.spendUsd);
        const trailing = await FinanceRepository.trailingHourlySpend(
          provider,
          bucketAt,
        );
        candidates.push(
          ...detectProviderAnomalies({
            provider,
            providerLabel: providerLabel(provider),
            spendUsd: delta.spendUsd,
            elapsedHours: delta.elapsedHours,
            trailingAvgHourlyUsd: trailing,
            balanceUsd: result.balanceUsd,
            thresholds,
          }),
        );
      }

      if (!dryRun) {
        const values = {
          provider,
          bucketAt,
          capturedAt: now,
          balanceUsd: result.balanceUsd,
          balanceNative: result.balanceNative,
          unit: result.unit,
          cumulativeUsageUsd: result.cumulativeUsageUsd,
          spendUsd: delta?.spendUsd ?? null,
          elapsedHours: delta?.elapsedHours ?? null,
        };
        await db
          .insert(financeProviderSnapshots)
          .values(values)
          .onConflictDoUpdate({
            target: [
              financeProviderSnapshots.provider,
              financeProviderSnapshots.bucketAt,
            ],
            set: values,
          });
      }

      return {
        ...base,
        status: SourceRunStatus.OK,
        balanceUsd: result.balanceUsd,
        spendUsd: delta?.spendUsd ?? null,
      };
    } catch (error) {
      logger.warn("[Finance] Provider balance failed", {
        provider,
        error: parseError(error).message,
      });
      return {
        ...base,
        status: SourceRunStatus.FAILED,
        reason: parseError(error).message,
      };
    }
  }

  /** Average dollars per hour over the trailing baseline, excluding the current bucket. */
  private static async trailingHourlySpend(
    provider: (typeof ProviderSources)[number],
    bucketAt: Date,
  ): Promise<number> {
    const from = new Date(
      bucketAt.getTime() - FINANCE_CONFIG.baselineDays * DAY_MS,
    );
    const [row] = await db
      .select({
        spend: sql<number>`coalesce(sum(${financeProviderSnapshots.spendUsd}), 0)`,
        hours: sql<number>`coalesce(sum(${financeProviderSnapshots.elapsedHours}), 0)`,
      })
      .from(financeProviderSnapshots)
      .where(
        and(
          eq(financeProviderSnapshots.provider, provider),
          gte(financeProviderSnapshots.bucketAt, from),
          lt(financeProviderSnapshots.bucketAt, bucketAt),
        ),
      );
    const hours = Number(row?.hours ?? 0);
    return hours > 0 ? Number(row?.spend ?? 0) / hours : 0;
  }

  // ─── Revenue ───────────────────────────────────────────────────────────────

  private static async ingestRevenue(
    source: (typeof RevenueSources)[number],
    since: Date,
    dryRun: boolean,
    pulled: RevenueEventInput[],
    logger: EndpointLogger,
  ): Promise<SourceReport> {
    const deps = FinanceRepository.deps;
    const base: SourceReport = {
      source,
      kind: "revenue",
      status: SourceRunStatus.SKIPPED,
      reason: null,
      balanceUsd: null,
      spendUsd: null,
      events: 0,
    };
    try {
      let pull: RevenuePull;
      if (source === FinanceSource.STRIPE) {
        const port = deps.stripePort();
        // Count real sales even when the Stripe API is missing or its account
        // diverges from our records, so revenue is never silently $0.
        pull = port
          ? await reconcileWithLocalSales(
              await pullStripe(port, since),
              PaymentProvider.STRIPE,
              FinanceSource.STRIPE,
              since,
            )
          : await pullLocalPaymentLedger(
              PaymentProvider.STRIPE,
              FinanceSource.STRIPE,
              since,
            );
      } else {
        const port = deps.nowPaymentsPort(deps.http);
        // Same reconciliation for crypto against the local IPN ledger.
        pull = port
          ? await reconcileWithLocalSales(
              pullNowPayments(await port.load(since)),
              PaymentProvider.NOWPAYMENTS,
              FinanceSource.NOWPAYMENTS,
              since,
            )
          : await pullLocalPaymentLedger(
              PaymentProvider.NOWPAYMENTS,
              FinanceSource.NOWPAYMENTS,
              since,
            );
      }

      pulled.push(...pull.events);
      if (!dryRun) {
        await FinanceRepository.persistEvents(source, pull.events, since);
      }
      const notes = [
        pull.note,
        pull.unconvertible > 0
          ? `${pull.unconvertible} rows skipped: currency without FX rate`
          : null,
      ].filter((n): n is string => n !== null);
      return {
        ...base,
        status: SourceRunStatus.OK,
        reason: notes.length > 0 ? notes.join("; ") : null,
        events: pull.events.length,
      };
    } catch (error) {
      logger.warn("[Finance] Revenue pull failed", {
        source,
        error: parseError(error).message,
      });
      return {
        ...base,
        status: SourceRunStatus.FAILED,
        reason: parseError(error).message,
      };
    }
  }

  /** Upsert raw rows by (source, kind, external id), then rebuild the window's daily snapshots. */
  private static async persistEvents(
    source: (typeof RevenueSources)[number],
    events: RevenueEventInput[],
    since: Date,
  ): Promise<void> {
    for (let i = 0; i < events.length; i += 500) {
      const chunk = events.slice(i, i + 500);
      await db
        .insert(financeRevenueEvents)
        .values(
          chunk.map((e) => ({
            source: e.source,
            kind: e.kind,
            externalId: e.externalId,
            amountUsd: e.amountUsd,
            feeUsd: e.feeUsd,
            currency: e.currency,
            occurredAt: e.occurredAt,
          })),
        )
        .onConflictDoUpdate({
          target: [
            financeRevenueEvents.source,
            financeRevenueEvents.kind,
            financeRevenueEvents.externalId,
          ],
          set: {
            amountUsd: sql`excluded.amount_usd`,
            feeUsd: sql`excluded.fee_usd`,
          },
        });
    }
    // Rebuild from the stored rows so a re-run is idempotent whatever was re-pulled.
    const stored = await db
      .select()
      .from(financeRevenueEvents)
      .where(
        and(
          eq(financeRevenueEvents.source, source),
          gte(financeRevenueEvents.occurredAt, startOfUtcDay(since)),
        ),
      )
      .orderBy(asc(financeRevenueEvents.occurredAt));
    const days = aggregateEvents(
      stored.map((s) => ({
        source,
        kind: s.kind,
        externalId: s.externalId,
        amountUsd: s.amountUsd,
        feeUsd: s.feeUsd,
        currency: s.currency,
        occurredAt: s.occurredAt,
      })),
    ).get(source);
    for (const [key, day] of days ?? []) {
      const values = {
        source,
        day: new Date(`${key}T00:00:00.000Z`),
        grossUsd: round2(day.grossUsd),
        refundsUsd: round2(day.refundsUsd),
        disputesUsd: round2(day.disputesUsd),
        netUsd: round2(day.grossUsd - day.refundsUsd - day.disputesUsd),
        payoutsUsd: round2(day.payoutsUsd),
        paymentCount: day.paymentCount,
        refundCount: day.refundCount,
        disputeCount: day.disputeCount,
        cancellationCount: day.cancellationCount,
        updatedAt: new Date(),
      };
      await db
        .insert(financeRevenueSnapshots)
        .values(values)
        .onConflictDoUpdate({
          target: [financeRevenueSnapshots.source, financeRevenueSnapshots.day],
          set: values,
        });
    }
  }

  // ─── Rollup ────────────────────────────────────────────────────────────────

  /** Margin for today and yesterday; queues day-level anomalies. */
  private static async rollup(
    now: Date,
    data: { dryRun: boolean },
    pulled: RevenueEventInput[],
    runSpend: Map<string, number>,
    thresholds: Thresholds,
    candidates: AlertCandidate[],
    logger: EndpointLogger,
  ): Promise<DayReport[]> {
    const today = startOfUtcDay(now);
    const yesterday = new Date(today.getTime() - DAY_MS);
    const firstSnapshotHour =
      await FinanceRepository.firstProviderSnapshotHour();
    const out: DayReport[] = [];
    for (const dayStart of [yesterday, today]) {
      const key = dayKey(dayStart);
      const isToday = key === dayKey(today);
      const comp = data.dryRun
        ? await FinanceRepository.computeDayDryRun(
            dayStart,
            now,
            firstSnapshotHour,
            pulled,
            runSpend,
            isToday,
          )
        : await FinanceRepository.rollupDay(dayStart, now, firstSnapshotHour, {
            persist: true,
          });
      out.push(comp.report);

      const trailingCancel =
        await FinanceRepository.trailingCancellations(dayStart);
      const anomalies = detectDayAnomalies(
        {
          day: key,
          grossRevenueUsd: comp.revenue.grossUsd,
          refundsUsd: comp.revenue.refundsUsd,
          disputesUsd: comp.revenue.disputesUsd,
          refundCount: comp.revenue.refundCount,
          disputeCount: comp.revenue.disputeCount,
          cancellationCount: comp.revenue.cancellationCount,
          trailingAvgCancellations: trailingCancel,
          upstreamCostUsd: comp.upstreamCostUsd ?? 0,
          internalBilledUsd: comp.internalBilledUsd,
        },
        thresholds,
      );
      // Margin / billing-gap are only judged on a complete, fully-tracked past
      // day: never on a partial "today", and never when cost coverage is not
      // COMPLETE (an incomplete cost would cry wolf with a false negative margin).
      const costTrusted = !isToday && comp.coverage === CostCoverage.COMPLETE;
      candidates.push(
        ...anomalies.filter(
          (a) =>
            costTrusted ||
            (a.type !== FinanceAlertType.NEGATIVE_MARGIN &&
              a.type !== FinanceAlertType.THIN_MARGIN &&
              a.type !== FinanceAlertType.BILLING_GAP),
        ),
      );
    }
    logger.debug("[Finance] Rollup computed", { days: out.length });
    return out;
  }

  /** Hour-floored earliest provider snapshot ever, or null when none exist. */
  private static async firstProviderSnapshotHour(): Promise<Date | null> {
    const [row] = await db
      .select({ bucketAt: financeProviderSnapshots.bucketAt })
      .from(financeProviderSnapshots)
      .orderBy(asc(financeProviderSnapshots.bucketAt))
      .limit(1);
    return row ? startOfUtcHour(row.bucketAt) : null;
  }

  /** Measured per-provider spend and distinct snapshot-hour count for a UTC day. */
  private static async readDayCost(
    dayStart: Date,
    next: Date,
  ): Promise<{ perProvider: Record<string, number>; snapshotHours: number }> {
    const spendRows = await db
      .select({
        provider: financeProviderSnapshots.provider,
        spend: sql<number>`coalesce(sum(${financeProviderSnapshots.spendUsd}), 0)`,
      })
      .from(financeProviderSnapshots)
      .where(
        and(
          gte(financeProviderSnapshots.bucketAt, dayStart),
          lt(financeProviderSnapshots.bucketAt, next),
        ),
      )
      .groupBy(financeProviderSnapshots.provider);
    const perProvider: Record<string, number> = {};
    for (const row of spendRows) {
      perProvider[row.provider] = round2(Number(row.spend));
    }
    const [hours] = await db
      .select({
        hours: sql<number>`count(distinct date_trunc('hour', ${financeProviderSnapshots.bucketAt}))`,
      })
      .from(financeProviderSnapshots)
      .where(
        and(
          gte(financeProviderSnapshots.bucketAt, dayStart),
          lt(financeProviderSnapshots.bucketAt, next),
        ),
      );
    return { perProvider, snapshotHours: Number(hours?.hours ?? 0) };
  }

  /** Read stored revenue snapshots for one UTC day into a DayRevenue total. */
  private static async readDayRevenue(dayStart: Date): Promise<DayRevenue> {
    const revenue = emptyDay();
    const snaps = await db
      .select()
      .from(financeRevenueSnapshots)
      .where(eq(financeRevenueSnapshots.day, dayStart));
    for (const s of snaps) {
      addDay(revenue, {
        grossUsd: s.grossUsd,
        refundsUsd: s.refundsUsd,
        disputesUsd: s.disputesUsd,
        refundCount: s.refundCount,
        disputeCount: s.disputeCount,
        paymentCount: s.paymentCount,
        cancellationCount: s.cancellationCount,
        payoutsUsd: s.payoutsUsd,
      });
    }
    return revenue;
  }

  /**
   * Finalize one day: classify cost coverage, compute margin ONLY when coverage
   * is COMPLETE (otherwise cost / margin are left unknown rather than faked),
   * optionally persist, and return the report plus the pieces anomaly detection
   * needs. The single place both the live rollup and the backfill agree on.
   */
  private static async finalizeDay(input: {
    dayStart: Date;
    now: Date;
    revenue: DayRevenue;
    perProvider: Record<string, number>;
    snapshotHours: number;
    firstSnapshotHour: Date | null;
    persist: boolean;
  }): Promise<DayComputation> {
    const { dayStart, revenue } = input;
    const next = new Date(dayStart.getTime() + DAY_MS);
    const internalBilledUsd = await FinanceRepository.internalBilled(
      dayStart,
      next,
    );
    const coverage = classifyCostCoverage({
      snapshotHours: input.snapshotHours,
      dayStart,
      dayEnd: next,
      firstSnapshotHour: input.firstSnapshotHour,
      now: input.now,
      gapToleranceHours: FINANCE_CONFIG.costGapToleranceHours,
    });
    const measuredCost = round2(
      Object.values(input.perProvider).reduce((a, b) => a + b, 0),
    );
    // NONE: cost unknown, store NULL (never 0). PARTIAL/COMPLETE: store what we measured.
    const upstreamCostUsd =
      coverage === CostCoverage.NONE ? null : measuredCost;
    const netRevenueUsd = round2(
      revenue.grossUsd - revenue.refundsUsd - revenue.disputesUsd,
    );
    // Margin only when the whole day's cost is trustworthy.
    const margin =
      coverage === CostCoverage.COMPLETE
        ? computeMargin({
            grossRevenueUsd: revenue.grossUsd,
            refundsUsd: revenue.refundsUsd,
            disputesUsd: revenue.disputesUsd,
            upstreamCostUsd: measuredCost,
            internalBilledUsd,
          })
        : null;
    const grossMarginUsd = margin ? margin.grossMarginUsd : null;
    const grossMarginPct = margin ? margin.grossMarginPct : null;
    const billingGapPct = margin ? margin.billingGapPct : null;

    if (input.persist) {
      const values = {
        day: dayStart,
        grossRevenueUsd: round2(revenue.grossUsd),
        refundsUsd: round2(revenue.refundsUsd),
        disputesUsd: round2(revenue.disputesUsd),
        netRevenueUsd,
        upstreamCostUsd,
        grossMarginUsd,
        grossMarginPct,
        internalBilledUsd: round2(internalBilledUsd),
        billingGapPct,
        cancellationCount: revenue.cancellationCount,
        perProviderSpend: input.perProvider,
        costCoverage: coverage,
        computedAt: new Date(),
      };
      await db.insert(financeDailyRollups).values(values).onConflictDoUpdate({
        target: financeDailyRollups.day,
        set: values,
      });
    }

    return {
      report: {
        day: dayKey(dayStart),
        grossRevenueUsd: round2(revenue.grossUsd),
        refundsUsd: round2(revenue.refundsUsd),
        disputesUsd: round2(revenue.disputesUsd),
        netRevenueUsd,
        upstreamCostUsd,
        grossMarginUsd,
        grossMarginPct,
        internalBilledUsd: round2(internalBilledUsd),
        costCoverage: coverage,
      },
      revenue,
      upstreamCostUsd,
      internalBilledUsd,
      coverage,
    };
  }

  /** Recompute one day from stored source ledgers (revenue snapshots + cost + credits). */
  private static async rollupDay(
    dayStart: Date,
    now: Date,
    firstSnapshotHour: Date | null,
    opts: { persist: boolean },
  ): Promise<DayComputation> {
    const next = new Date(dayStart.getTime() + DAY_MS);
    const revenue = await FinanceRepository.readDayRevenue(dayStart);
    const { perProvider, snapshotHours } = await FinanceRepository.readDayCost(
      dayStart,
      next,
    );
    return FinanceRepository.finalizeDay({
      dayStart,
      now,
      revenue,
      perProvider,
      snapshotHours,
      firstSnapshotHour,
      persist: opts.persist,
    });
  }

  /** Dry-run day: revenue from what this run pulled, cost overlaid with runSpend; nothing persisted. */
  private static async computeDayDryRun(
    dayStart: Date,
    now: Date,
    firstSnapshotHour: Date | null,
    pulled: RevenueEventInput[],
    runSpend: Map<string, number>,
    isToday: boolean,
  ): Promise<DayComputation> {
    const next = new Date(dayStart.getTime() + DAY_MS);
    const key = dayKey(dayStart);
    const revenue = emptyDay();
    for (const days of aggregateEvents(pulled).values()) {
      addDay(revenue, days.get(key));
    }
    const { perProvider, snapshotHours } = await FinanceRepository.readDayCost(
      dayStart,
      next,
    );
    if (isToday) {
      for (const [provider, spend] of runSpend) {
        perProvider[provider] = round2((perProvider[provider] ?? 0) + spend);
      }
    }
    return FinanceRepository.finalizeDay({
      dayStart,
      now,
      revenue,
      perProvider,
      snapshotHours,
      firstSnapshotHour,
      persist: false,
    });
  }

  // ─── Backfill ──────────────────────────────────────────────────────────────

  /**
   * Validate the range, then recompute the daily rollups across it. Reuses the
   * same per-day rollup as the live path and raises no alerts. Revenue + billed
   * come from complete source history, so every day is accurate; upstream cost
   * is only trustworthy where snapshots exist and is flagged per day otherwise.
   */
  private static async runBackfill(
    data: { backfillFrom?: string; backfillTo?: string; dryRun: boolean },
    now: Date,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FinanceIngestResponseOutput>> {
    const from = new Date(data.backfillFrom ?? "");
    const to =
      data.backfillTo !== undefined && data.backfillTo.trim() !== ""
        ? new Date(data.backfillTo)
        : now;
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return fail({
        message: t("errors.backfill.invalidRange"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const fromDay = startOfUtcDay(from);
    const toDay = startOfUtcDay(to);
    if (fromDay.getTime() > toDay.getTime()) {
      return fail({
        message: t("errors.backfill.invalidRange"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const spanDays =
      Math.round((toDay.getTime() - fromDay.getTime()) / DAY_MS) + 1;
    if (spanDays > FINANCE_CONFIG.backfillMaxDays) {
      return fail({
        message: t("errors.backfill.tooWide", {
          max: FINANCE_CONFIG.backfillMaxDays,
        }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // 1. Rebuild revenue snapshots across the range from the complete local
    //    payment ledger (uncapped, idempotent). The source of historical truth.
    const sources: SourceReport[] = [];
    for (const source of RevenueSources) {
      sources.push(await FinanceRepository.backfillRevenue(source, fromDay));
    }
    if (!data.dryRun) {
      for (const report of sources) {
        await FinanceRepository.recordSourceStatus(report, now);
      }
    }

    // 2. Recompute every day in the range from the now-rebuilt ledgers.
    const firstSnapshotHour =
      await FinanceRepository.firstProviderSnapshotHour();
    const days: DayReport[] = [];
    for (let ms = fromDay.getTime(); ms <= toDay.getTime(); ms += DAY_MS) {
      const comp = await FinanceRepository.rollupDay(
        new Date(ms),
        now,
        firstSnapshotHour,
        { persist: !data.dryRun },
      );
      days.push(comp.report);
    }
    logger.info("[Finance] Backfill complete", {
      from: dayKey(fromDay),
      to: dayKey(toDay),
      days: days.length,
      dryRun: data.dryRun,
    });

    return success({
      ranAt: now.toISOString(),
      dryRunResult: data.dryRun,
      sources,
      days,
      alertsRaised: 0,
      alertsSuppressed: 0,
      alerts: [],
    });
  }

  /** Rebuild one revenue source's events + daily snapshots from our own succeeded payments. */
  private static async backfillRevenue(
    source: (typeof RevenueSources)[number],
    since: Date,
  ): Promise<SourceReport> {
    const base: SourceReport = {
      source,
      kind: "revenue",
      status: SourceRunStatus.SKIPPED,
      reason: null,
      balanceUsd: null,
      spendUsd: null,
      events: 0,
    };
    const provider =
      source === FinanceSource.STRIPE
        ? PaymentProvider.STRIPE
        : PaymentProvider.NOWPAYMENTS;
    const pull = await pullLocalPaymentLedger(provider, source, since);
    await FinanceRepository.persistEvents(source, pull.events, since);
    return {
      ...base,
      status: SourceRunStatus.OK,
      reason: pull.note,
      events: pull.events.length,
    };
  }

  /** Credits users burned in [from, to) valued at the credit price. */
  static async internalBilled(from: Date, to: Date): Promise<number> {
    const [row] = await db
      .select({
        total: sql<number>`coalesce(sum(${creditTransactions.amount}), 0)`,
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.type, CreditTransactionType.USAGE),
          gte(creditTransactions.createdAt, from),
          lt(creditTransactions.createdAt, to),
        ),
      );
    return Math.abs(Number(row?.total ?? 0)) * FINANCE_CONFIG.creditValueUsd;
  }

  /** Average daily cancellations over the baseline window before `day`. */
  private static async trailingCancellations(day: Date): Promise<number> {
    const from = new Date(day.getTime() - FINANCE_CONFIG.baselineDays * DAY_MS);
    const [row] = await db
      .select({
        total: sql<number>`coalesce(sum(${financeRevenueSnapshots.cancellationCount}), 0)`,
      })
      .from(financeRevenueSnapshots)
      .where(
        and(
          gte(financeRevenueSnapshots.day, from),
          lt(financeRevenueSnapshots.day, day),
        ),
      );
    return Number(row?.total ?? 0) / FINANCE_CONFIG.baselineDays;
  }

  private static async recordSourceStatus(
    report: SourceReport,
    now: Date,
  ): Promise<void> {
    const ok = report.status === SourceRunStatus.OK;
    await db
      .insert(financeSourceStatus)
      .values({
        source: report.source,
        lastRunAt: now,
        lastStatus: report.status,
        lastReason: report.reason,
        lastOkAt: ok ? now : null,
      })
      .onConflictDoUpdate({
        target: financeSourceStatus.source,
        set: {
          lastRunAt: now,
          lastStatus: report.status,
          lastReason: report.reason,
          ...(ok ? { lastOkAt: now } : {}),
        },
      });
  }

  // ─── Alerts ────────────────────────────────────────────────────────────────

  /**
   * Dedup each candidate against recent alerts with the same key, then log at
   * error level (reaches error_logs / the Thea error monitor) and mail the
   * admin recipient. A dry run reports what would fire and touches nothing.
   */
  static async raiseAlerts(
    candidates: AlertCandidate[],
    thresholds: Thresholds,
    dryRun: boolean,
    now: Date,
    userId: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<AlertReport[]> {
    const deps = FinanceRepository.deps;
    const out: AlertReport[] = [];
    for (const c of candidates) {
      const [last] = await db
        .select({ createdAt: financeAlerts.createdAt })
        .from(financeAlerts)
        .where(eq(financeAlerts.dedupKey, c.dedupKey))
        .orderBy(desc(financeAlerts.createdAt))
        .limit(1);
      const report = (delivery: string): AlertReport => ({
        type: c.type,
        severity: c.severity,
        subject: c.subject,
        message: c.message,
        delivery,
      });
      if (
        isDuplicateAlert(
          last?.createdAt ?? null,
          now,
          thresholds.alertDedupHours,
        )
      ) {
        out.push(report("suppressed"));
        continue;
      }
      if (dryRun) {
        out.push(report("dry-run"));
        continue;
      }

      let delivery: string;
      const recipients = deps.recipients();
      if (recipients.length === 0) {
        delivery = "skipped: no recipient (set THEA_MAIL_ADDRESS)";
      } else {
        const subject = `[finance] ${c.severity === "enums.severity.critical" ? "CRITICAL" : "WARNING"}: ${c.message.slice(0, 120)}`;
        const text = `${c.message}\n\n${JSON.stringify(c.metadata, null, 2)}\n\nOpen Finance in the admin to review balances and thresholds.`;
        const failures: string[] = [];
        for (const to of recipients) {
          try {
            const mail = await deps.sendMail(
              { to, subject, text },
              userId,
              logger,
              locale,
            );
            if (!mail.ok) {
              failures.push(`${to}: ${mail.detail}`);
            }
          } catch (error) {
            failures.push(`${to}: ${parseError(error).message}`);
          }
        }
        delivery =
          failures.length === 0 ? "sent" : `failed: ${failures.join("; ")}`;
      }

      await db.insert(financeAlerts).values({
        type: c.type,
        severity: c.severity,
        subject: c.subject,
        dedupKey: c.dedupKey,
        message: c.message,
        metadata: c.metadata,
        delivery,
        createdAt: now,
      });
      // Error level on purpose: lands in error_logs and the Thea error monitor.
      logger.error(`[Finance] ALERT ${c.type}: ${c.message}`, {
        subject: c.subject,
        delivery,
      });
      out.push(report(delivery));
    }
    return out;
  }

  // ─── Status ────────────────────────────────────────────────────────────────

  static async status(
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FinanceStatusResponseOutput>> {
    try {
      const now = FinanceRepository.deps.now();
      const providerRows = await db
        .select()
        .from(financeProviderSnapshots)
        .where(inArray(financeProviderSnapshots.provider, [...ProviderSources]))
        .orderBy(desc(financeProviderSnapshots.capturedAt))
        .limit(500);
      const statusRows = await db.select().from(financeSourceStatus);

      const sources = [...ProviderSources, ...RevenueSources].map((source) => {
        const status = statusRows.find((s) => s.source === source);
        const snap = providerRows.find((p) => p.provider === source);
        return {
          source,
          status: status?.lastStatus ?? null,
          reason: status?.lastReason ?? null,
          lastRunAt: status?.lastRunAt.toISOString() ?? null,
          lastOkAt: status?.lastOkAt?.toISOString() ?? null,
          balanceUsd: snap?.balanceUsd ?? null,
          balanceNative: snap?.balanceNative ?? null,
          unit: snap?.unit ?? null,
          lastSpendUsd: snap?.spendUsd ?? null,
        };
      });

      const since = new Date(startOfUtcDay(now).getTime() - 7 * DAY_MS);
      const rollups = await db
        .select()
        .from(financeDailyRollups)
        .where(gte(financeDailyRollups.day, since))
        .orderBy(desc(financeDailyRollups.day));
      const days = rollups.map((r) => ({
        day: dayKey(r.day),
        netRevenueUsd: r.netRevenueUsd,
        upstreamCostUsd: r.upstreamCostUsd,
        grossMarginUsd: r.grossMarginUsd,
        grossMarginPct: r.grossMarginPct,
        billingGapPct: r.billingGapPct,
        costCoverage: r.costCoverage,
      }));
      // Revenue is always known; cost / margin only over days whose cost we
      // actually captured (coverage != NONE), so the week total never mixes in a
      // faked zero for an untracked day. The week is flagged partial when any day
      // in it lacks complete cost coverage.
      const net = rollups.reduce((a, r) => a + r.netRevenueUsd, 0);
      const cost = rollups.reduce((a, r) => a + (r.upstreamCostUsd ?? 0), 0);
      const costComplete = rollups.every(
        (r) => r.costCoverage === CostCoverage.COMPLETE,
      );
      const weekMargin = computeMargin({
        grossRevenueUsd: net,
        refundsUsd: 0,
        disputesUsd: 0,
        upstreamCostUsd: cost,
        internalBilledUsd: 0,
      });

      const alertRows = await db
        .select()
        .from(financeAlerts)
        .orderBy(desc(financeAlerts.createdAt))
        .limit(15);
      const thresholdRows = await db.select().from(financeThresholds);

      const lastIngestAt = statusRows.reduce<Date | null>(
        (acc, s) => (acc === null || s.lastRunAt > acc ? s.lastRunAt : acc),
        null,
      );

      return success({
        lastIngestAt: lastIngestAt?.toISOString() ?? null,
        sources,
        week: {
          netRevenueUsd: round2(net),
          upstreamCostUsd: round2(cost),
          grossMarginUsd: weekMargin.grossMarginUsd,
          grossMarginPct: weekMargin.grossMarginPct,
          costComplete,
        },
        days,
        alerts: alertRows.map((a) => ({
          id: a.id,
          type: a.type,
          severity: a.severity,
          subject: a.subject,
          message: a.message,
          delivery: a.delivery,
          createdAt: a.createdAt.toISOString(),
        })),
        thresholds: Object.values(ThresholdKey).map((key) => {
          const row = thresholdRows.find((r) => r.key === key);
          const field = THRESHOLD_FIELD[key];
          return {
            key,
            value: row?.value ?? DEFAULT_THRESHOLDS[field],
            defaultValue: DEFAULT_THRESHOLDS[field],
            enabled: row?.enabled ?? false,
            note: row?.note ?? null,
          };
        }),
      });
    } catch (error) {
      logger.error("[Finance] Status failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

function addDay(target: DayRevenue, add: DayRevenue | undefined): void {
  if (!add) {
    return;
  }
  target.grossUsd += add.grossUsd;
  target.refundsUsd += add.refundsUsd;
  target.disputesUsd += add.disputesUsd;
  target.refundCount += add.refundCount;
  target.disputeCount += add.disputeCount;
  target.paymentCount += add.paymentCount;
  target.cancellationCount += add.cancellationCount;
  target.payoutsUsd += add.payoutsUsd;
}
