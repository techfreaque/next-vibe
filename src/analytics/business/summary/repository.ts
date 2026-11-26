import "server-only";

import { DrizzleQueryError, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getUnhealthyConnectionCount } from "next-vibe/remote-connection/health-summary";
import { getFailingTaskCount } from "next-vibe/tasks/cron/health-summary";
import { translateTaskName } from "next-vibe/tasks/cron/task-names";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import {
  AnalyticsGranularity,
  AnalyticsRange,
} from "next-vibe/unified-ui/analytics/enum";
import {
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";

import { CreditUsageReportRepository } from "@/credits/analytics/usage/repository";
import { getAcquisitionHeadline } from "@/leads/analytics/overview";
import {
  REPORTABLE_PAYMENT_SQL,
  reportingUserSql,
  utcTs,
} from "@/payment/analytics/money-sql";
import { RevenueReportRepository } from "@/payment/analytics/revenue/repository";
import { PaymentStatus } from "@/payment/enum";
import { humanUserSql } from "@/users/audience-sql";

import type { BusinessOverviewT } from "../overview/i18n";
import type { PlatformSummaryInput, PlatformSummaryOutput } from "./definition";

type Section = NonNullable<PlatformSummaryInput["section"]>;
type Summary = PlatformSummaryOutput["summary"];

function acquisitionKpis(
  headline?: Awaited<ReturnType<typeof getAcquisitionHeadline>>,
): Summary["kpis"] {
  return [
    {
      label: "get.widget.kpi.humanLeads",
      format: "number",
      value: headline?.humanLeads.value ?? null,
      previous: headline?.humanLeads.previous,
      sparkline: headline?.leadsTrend,
      drill: { alias: "acquisition-report" },
    },
    {
      label: "get.widget.kpi.signups",
      format: "number",
      value: headline?.signups.value ?? null,
      previous: headline?.signups.previous,
      sparkline: headline?.signupsTrend,
      drill: { alias: "acquisition-report" },
    },
  ];
}

function moneyKpis(
  headline?: Awaited<ReturnType<typeof RevenueReportRepository.headline>>,
  settlement = false,
): Summary["kpis"] {
  return [
    {
      label: "get.widget.kpi.payers",
      format: "number",
      value: headline?.payingCustomers.value ?? null,
      previous: headline?.payingCustomers.previous,
      sparkline: headline?.payingCustomersTrend,
      drill: { alias: "revenue-report" },
    },
    {
      label: settlement
        ? "platformSummary.grossReceipts"
        : "get.widget.kpi.revenue",
      format: "money",
      currency: "USD",
      value: headline?.revenueUsd.value ?? null,
      previous: headline?.revenueUsd.previous,
      sparkline: headline?.revenueTrend,
      drill: { alias: "revenue-report" },
    },
    ...(settlement
      ? ([
          {
            label: "platformSummary.refunds",
            format: "money",
            currency: "USD",
            value: headline?.refundsUsd?.value ?? null,
            previous: headline?.refundsUsd?.previous,
            invertDelta: true,
            drill: { alias: "revenue-report" },
          },
          {
            label: "platformSummary.netReceipts",
            format: "money",
            currency: "USD",
            value: headline?.netRevenueUsd?.value ?? null,
            previous: headline?.netRevenueUsd?.previous,
            drill: { alias: "revenue-report" },
          },
        ] satisfies Summary["kpis"])
      : []),
  ];
}

function usageKpis(
  usage?: Awaited<ReturnType<typeof CreditUsageReportRepository.headline>>,
): Summary["kpis"] {
  return [
    {
      label: "platformSummary.valuationCost",
      invertDelta: true,
      format: "money",
      currency: "USD",
      value: usage?.estimatedCostUsd?.value ?? null,
      previous: usage?.estimatedCostUsd?.previous,
      drill: { alias: "credit-usage-report" },
    },
    {
      label: "platformSummary.valuationMargin",
      format: "money",
      currency: "USD",
      value: usage?.costedUsageMarginUsd?.value ?? null,
      previous: usage?.costedUsageMarginUsd?.previous,
      drill: { alias: "credit-usage-report" },
    },
  ];
}

async function recentActivity(
  locale: CountryLanguage,
  win: ReturnType<typeof resolveAnalyticsWindow>,
): Promise<Summary["recent"]> {
  const from = utcTs(win.from),
    to = utcTs(win.to);
  // The home shows the registration language, amount received or system task name.
  const rows = await db.execute<{
    kind: "account" | "payment" | "task";
    at: string;
    language: string | null;
    amount: string | null;
    currency: string | null;
    taskId: string | null;
    routeId: string | null;
    taskName: string | null;
  }>(sql`
    SELECT kind, to_char(at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS at,
      language, amount, currency, "taskId", "routeId", "taskName"
    FROM (
      (SELECT 'account'  AS kind, ${users.createdAt} AS at,
        split_part(${users.locale}, '-', 1) AS language, null::text AS amount, null::text AS currency,
        null::text AS "taskId", null::text AS "routeId", null::text AS "taskName" FROM ${users}
        WHERE ${users.createdAt} >= ${from} AND ${users.createdAt} < ${to} AND ${humanUserSql(users.id, users.email)}
        ORDER BY ${users.createdAt} DESC LIMIT 1)
      UNION ALL
      (SELECT 'payment', pt.created_at AS at, null, pt.amount::text, pt.currency, null, null, null FROM payment_transactions pt
        WHERE pt.created_at >= ${from} AND pt.created_at < ${to} AND ${REPORTABLE_PAYMENT_SQL}
          AND ${reportingUserSql("pt.user_id")} AND pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})
        ORDER BY pt.created_at DESC LIMIT 1)
      UNION ALL
      (SELECT 'task', e.completed_at AS at, null, null, null, ct.id, ct.route_id, ct.display_name FROM cron_task_executions e JOIN cron_tasks ct ON ct.id=e.task_id
        WHERE e.completed_at >= ${from} AND e.completed_at < ${to} AND ct.user_id IS NULL
          AND NOT e.is_dry_run AND e.status=${CronTaskStatus.COMPLETED}
        ORDER BY e.completed_at DESC LIMIT 1)
    ) AS activity ORDER BY activity.at DESC, kind`);
  const labels = {
    account: "platformSummary.newAccount",
    payment: "platformSummary.receivedPayment",
    task: "platformSummary.completedTask",
  } as const;
  const aliases = {
    account: "users-list",
    payment: "revenue-report",
    task: "cron-history",
  } as const;
  return Promise.all(
    rows.rows.map(async (row): Promise<Summary["recent"][number]> => {
      let detail: Summary["recent"][number]["detail"];
      if (row.kind === "payment" && row.amount !== null && row.currency) {
        detail = {
          kind: "money",
          amount: Number(row.amount),
          currency: row.currency,
        };
      } else if (
        row.kind === "account" &&
        row.language &&
        /^[a-z]{2,3}$/u.test(row.language)
      ) {
        const language = new Intl.DisplayNames([locale.split("-")[0]], {
          type: "language",
        }).of(row.language);
        if (language) {
          detail = { kind: "name", value: language };
        }
      } else if (row.taskId && row.routeId && row.taskName) {
        const name = await translateTaskName(
          {
            id: row.taskId,
            routeId: row.routeId,
            displayName: row.taskName,
            userId: null,
          },
          locale,
        );
        if (name) {
          detail = { kind: "name", value: name };
        }
      }
      return {
        label: labels[row.kind],
        at: row.at,
        detail,
        drill: { alias: aliases[row.kind] },
      };
    }),
  );
}

async function getSection(
  locale: CountryLanguage,
  section: Section,
  win: ReturnType<typeof resolveAnalyticsWindow>,
): Promise<
  Pick<Summary, "kpis" | "attention" | "attentionAvailable"> &
    Partial<Pick<Summary, "recent">>
> {
  if (section === "activity") {
    return {
      kpis: [],
      attention: [],
      attentionAvailable: false,
      recent: await recentActivity(locale, win),
    };
  }
  if (section === "usage") {
    return {
      kpis: usageKpis(await CreditUsageReportRepository.headline(win)),
      attention: [],
      attentionAvailable: false,
    };
  }
  if (section === "operations") {
    const [tasks, connections] = await Promise.all([
      getFailingTaskCount(),
      getUnhealthyConnectionCount(),
    ]);
    const attention: Summary["attention"] = [];
    if (tasks) {
      attention.push({
        label: "get.widget.alerts.tasks",
        count: tasks,
        severity: "warning",
        drill: { alias: "task-health" },
      });
    }
    if (connections) {
      attention.push({
        label: "get.widget.alerts.connections",
        count: connections,
        severity: "danger",
        drill: { alias: "remote-connections" },
      });
    }
    return { kpis: [], attention, attentionAvailable: true };
  }
  const kpis =
    section === "money" || section === "payments"
      ? moneyKpis(
          await RevenueReportRepository.headline(win, section === "payments"),
          section === "payments",
        )
      : acquisitionKpis(await getAcquisitionHeadline(win));
  return { kpis, attention: [], attentionAvailable: false };
}

export class PlatformSummaryRepository {
  private static readonly pendingSections = new Map<
    string,
    ReturnType<typeof getSection>
  >();

  private static loadSection(
    locale: CountryLanguage,
    section: Section,
    win: ReturnType<typeof resolveAnalyticsWindow>,
  ): ReturnType<typeof getSection> {
    // The fixed 30-day window changes at UTC midnight. Only recent activity
    // resolves locale-specific task names. All sections are platform-wide.
    const key = `${win.to.getTime()}:${section}:${section === "activity" ? locale : ""}`;
    const pending = PlatformSummaryRepository.pendingSections.get(key);
    if (pending) {
      return pending;
    }
    const load = getSection(locale, section, win).finally(() => {
      PlatformSummaryRepository.pendingSections.delete(key);
    });
    PlatformSummaryRepository.pendingSections.set(key, load);
    return load;
  }

  static async get(
    logger: EndpointLogger,
    t: BusinessOverviewT,
    locale: CountryLanguage,
    section?: Section,
    profile?: PlatformSummaryInput["profile"],
  ): Promise<ResponseType<PlatformSummaryOutput>> {
    const win = resolveAnalyticsWindow({
      range: AnalyticsRange.LAST_30_DAYS,
      granularity: AnalyticsGranularity.AUTO,
    });
    const { from, to } = serializeWindow(win);
    const sections: Section[] = section
      ? [section]
      : profile === "home"
        ? ["acquisition", "money", "usage", "operations", "activity"]
        : ["acquisition", "money", "operations"];
    const results = await Promise.allSettled(
      sections.map((name) =>
        PlatformSummaryRepository.loadSection(locale, name, win),
      ),
    );
    const summary: Summary = {
      from,
      to,
      kpis: [],
      attention: [],
      attentionAvailable: false,
      recent: [],
    };
    for (const [index, result] of results.entries()) {
      if (result.status === "rejected") {
        const error = result.reason;
        // Drizzle's SQL text can fill the log limit before the driver error.
        logger.error(
          "Platform summary source failed",
          error instanceof DrizzleQueryError && error.cause instanceof Error
            ? error.cause
            : parseError(error),
          { section: sections[index] },
        );
        if (section) {
          return fail({
            message: t("get.errors.server.description"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        // Standalone callers retain the metric slots when a source is unavailable.
        const missing = sections[index];
        if (missing === "acquisition") {
          summary.kpis.push(...acquisitionKpis());
        } else if (missing === "money") {
          summary.kpis.push(...moneyKpis());
        } else if (missing === "usage") {
          summary.kpis.push(...usageKpis());
        }
        continue;
      }
      summary.kpis.push(...result.value.kpis);
      summary.attention.push(...result.value.attention);
      if (result.value.recent) {
        summary.recent.push(...result.value.recent);
      }
      summary.attentionAvailable ||= result.value.attentionAvailable;
    }
    return success({ summary });
  }
}
