import "server-only";

import { createHash } from "node:crypto";

import { and, desc, eq, gt, lt, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  publicCapEvents,
  publicCapReservations,
  publicCapSpenders,
  publicFreeTierDailyCap,
} from "./db";
import type {
  PublicCapGetResponseOutput,
  PublicCapPostResponseOutput,
} from "./definition";
import type { PublicCapT } from "./i18n";
import { scopedTranslation } from "./i18n";

export type PublicCapEventKind =
  | "global-cap"
  | "lead-cap"
  | "ip-cap"
  | "single-request"
  | "fail-closed"
  | "pool-reserved"
  | "threshold-80"
  | "threshold-100";

/** One advisory lock serializes every reserving gate (short critical section). */
const RESERVATION_LOCK_KEY = 7_311_026;
/** An unbilled request (provider error, abort) frees its reservation after this. */
const RESERVATION_TTL_MS = 5 * 60 * 1000;

export interface PublicCapAllowance {
  remaining: number;
  limitMessage: TranslatedKeyType;
}

export interface PublicCapGateParams {
  leadId: string | undefined;
  ipAddress: string | undefined;
  /** Expected cost of the request (model cost at default token estimate) */
  expectedCost: number;
  model: string;
  /**
   * Reserve `expectedCost` for this request (pre-generation model usage).
   * `spendable` = the pool's free credits at validation time; live
   * reservations of the same pool are subtracted from it.
   */
  reservation?: { poolKey: string; spendable?: number };
  /** Who asks: guest (lead only) or a signed-in account without paid credits. */
  actor?: PublicCapActor;
}

export interface PublicCapActor {
  userId?: string;
  isSignedIn: boolean;
}

/** Settled vs reserved split behind a refusal's totals (log evidence only). */
interface PublicCapRefusalEvidence {
  poolSettledToday: number;
  poolReservedLive: number;
  leadSettledToday?: number;
  leadReservedLive?: number;
  ipSettledToday?: number;
  ipReservedLive?: number;
  walletPoolKey?: string;
  walletSpendable?: number;
  walletReservedLive?: number;
}

/** Credit amounts in logs: two decimals, no float noise (2627.1299999999997). */
function roundCredits(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Hard-ceiling design (kept deliberately simple):
 * - Gate (pre-generation): rejects when spendToday >= cap, when the request's
 *   expected cost alone exceeds what is left, or when the lead / IP has used its
 *   daily sub-cap. Fails CLOSED on any DB error.
 * - Spend (post-generation): single atomic SQL increment (no read-modify-write),
 *   which also tracks per-lead / per-IP spend and logs 80% / 100% crossings.
 * Overshoot is bounded to generations already in flight when the cap is crossed.
 */
export class PublicCapRepository {
  /** Lead/IP identifiers shown in admin; IPs are never stored raw */
  static hashIp(ip: string): string {
    return createHash("sha256").update(ip).digest("hex").slice(0, 16);
  }

  /** Midnight (server local) of today - rows last reset before this are stale */
  private static startOfToday(): Date {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /** When the daily counters reset (the lazy reset in gate runs after this). */
  static nextReset(): Date {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }

  private static async recordEvent(
    event: {
      kind: PublicCapEventKind;
      leadId?: string;
      ipHash?: string;
      model?: string;
      cost: number;
      spendToday: number;
      capAmount: number;
      /** lead-cap / ip-cap: the sub-cap that refused and what was spent on it */
      subCapSpend?: number;
      subCap?: number;
      /** Who asked: the free tier covers guests AND signed-in free accounts. */
      actor?: PublicCapActor;
      /** Pool math behind the decision (settled vs reserved credits). */
      evidence?: PublicCapRefusalEvidence;
    },
    logger: EndpointLogger,
  ): Promise<void> {
    // Named per kind: "[PublicCap] event" said nothing about which guard
    // fired. lead-cap / ip-cap / global-cap / single-request / pool-reserved =
    // a free-tier request was refused; threshold-80 = the shared pool is 80%
    // spent, threshold-100 = it is used up; fail-closed = the cap check could
    // not read the DB and refused.
    // The free tier serves guests AND signed-in accounts without paid
    // credits; "guest request refused" on a signed-in user's refusal sent
    // triage looking for a session bug (2026-11-27). The label names the actor.
    const isThreshold =
      event.kind === "threshold-80" || event.kind === "threshold-100";
    const actorLabel =
      event.actor === undefined
        ? "free-tier"
        : event.actor.isSignedIn
          ? "signed-in free user"
          : "guest";
    // Refused amount on top of the limit that refused it: > 0 proves the
    // refusal arithmetically (limit - used < cost).
    const limit = event.subCap ?? event.capAmount;
    const used =
      event.subCap === undefined ? event.spendToday : event.subCapSpend;
    logger.warn(
      isThreshold
        ? `[PublicCap] ${event.kind}: shared free-tier pool spend crossed`
        : `[PublicCap] ${event.kind}: ${actorLabel} request refused`,
      {
        kind: event.kind,
        actor:
          event.actor === undefined
            ? "unknown"
            : event.actor.isSignedIn
              ? "signed-in"
              : "guest",
        // Per occurrence (outside the fingerprint): who, what and the math.
        refusalDetail: {
          userId: event.actor?.userId ?? null,
          isSignedIn: event.actor?.isSignedIn ?? null,
          leadId: event.leadId ?? null,
          ipHash: event.ipHash ?? null,
          model: event.model ?? null,
          cost: event.cost,
          poolSpendToday: event.spendToday,
          capAmount: event.capAmount,
          subCap: event.subCap ?? null,
          subCapSpend: event.subCapSpend ?? null,
          limitLeft: used === undefined ? null : roundCredits(limit - used),
          overLimitBy:
            used === undefined ? null : roundCredits(used + event.cost - limit),
          ...event.evidence,
        },
      },
    );
    try {
      await db.insert(publicCapEvents).values({
        kind: event.kind,
        leadId: event.leadId ?? null,
        ipHash: event.ipHash ?? null,
        model: event.model ?? null,
        cost: event.cost,
        spendToday: event.spendToday,
        capAmount: event.capAmount,
      });
    } catch (error) {
      logger.error("[PublicCap] failed to record event", parseError(error));
    }
  }
  /** Default daily cap if env var is not set */
  private static readonly DEFAULT_CAP = 500;
  private static todayString(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  /**
   * Get or create the single config row, resetting spendToday if a new day has started.
   * Lazy midnight reset: happens on the first read/write after midnight.
   */
  private static async getOrCreateRow(
    logger: EndpointLogger,
    t: PublicCapT,
  ): Promise<ResponseType<typeof publicFreeTierDailyCap.$inferSelect>> {
    try {
      const [row] = await db.select().from(publicFreeTierDailyCap).limit(1);

      if (!row) {
        // First ever call - seed the row
        const [created] = await db
          .insert(publicFreeTierDailyCap)
          .values({ capAmount: PublicCapRepository.DEFAULT_CAP, spendToday: 0 })
          .returning();
        if (!created) {
          return fail({
            message: t("repository.getCapFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        return success(created);
      }

      // Lazy midnight reset: if lastResetAt date differs from today, zero spendToday
      const resetDate = row.lastResetAt.toISOString().slice(0, 10);
      if (resetDate !== PublicCapRepository.todayString()) {
        const [reset] = await db
          .update(publicFreeTierDailyCap)
          .set({
            spendToday: 0,
            lastResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(publicFreeTierDailyCap.id, row.id))
          .returning();
        if (!reset) {
          return fail({
            message: t("repository.getCapFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        return success(reset);
      }

      return success(row);
    } catch (error) {
      logger.error("Failed to get/create public cap row", parseError(error));
      return fail({
        message: t("repository.getCapFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * GET handler - returns current status for admin view.
   */
  static async getStatus(
    logger: EndpointLogger,
    t: PublicCapT,
  ): Promise<ResponseType<PublicCapGetResponseOutput>> {
    const rowResult = await this.getOrCreateRow(logger, t);
    if (!rowResult.success) {
      return rowResult;
    }

    const row = rowResult.data;
    const remaining = Math.max(0, row.capAmount - row.spendToday);
    const percentUsed =
      row.capAmount > 0
        ? Math.round((row.spendToday / row.capAmount) * 1000) / 10
        : 0;

    const day = PublicCapRepository.todayString();
    const topRows = await db
      .select()
      .from(publicCapSpenders)
      .where(eq(publicCapSpenders.day, day))
      .orderBy(desc(publicCapSpenders.spend))
      .limit(10);
    const eventRows = await db
      .select()
      .from(publicCapEvents)
      .orderBy(desc(publicCapEvents.createdAt))
      .limit(15);

    return success({
      perLeadCap: row.perLeadCap,
      perIpCap: row.perIpCap,
      topSpenders: topRows.map((r) => ({
        kind: r.kind,
        key: r.key,
        spend: r.spend,
      })),
      recentEvents: eventRows.map((e) => ({
        kind: e.kind,
        leadId: e.leadId ?? "",
        ipHash: e.ipHash ?? "",
        model: e.model ?? "",
        cost: e.cost,
        createdAt: e.createdAt,
      })),
      spendToday: row.spendToday,
      capAmount: row.capAmount,
      remainingToday: remaining,
      percentUsed,
      lastResetAt: row.lastResetAt,
      capExceeded: row.spendToday >= row.capAmount,
    });
  }

  /**
   * POST handler - update the cap amount.
   */
  static async updateCap(
    capAmount: number,
    logger: EndpointLogger,
    t: PublicCapT,
    subCaps?: { perLeadCap?: number; perIpCap?: number },
  ): Promise<ResponseType<PublicCapPostResponseOutput>> {
    try {
      const rowResult = await this.getOrCreateRow(logger, t);
      if (!rowResult.success) {
        return rowResult;
      }

      await db
        .update(publicFreeTierDailyCap)
        .set({
          capAmount,
          ...(subCaps?.perLeadCap !== undefined
            ? { perLeadCap: subCaps.perLeadCap }
            : {}),
          ...(subCaps?.perIpCap !== undefined
            ? { perIpCap: subCaps.perIpCap }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(publicFreeTierDailyCap.id, rowResult.data.id));

      return success({
        message: t("repository.capUpdated", { capAmount }),
      });
    } catch (error) {
      logger.error("Failed to update public cap", parseError(error));
      return fail({
        message: t("repository.updateCapFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Atomic spend increment (single SQL statement, includes lazy midnight reset).
   * Also tracks per-lead / per-IP spend and logs 80% / 100% pool crossings.
   * Non-fatal: failures are logged and never fail the credit deduction.
   */
  static async incrementSpend(
    amount: number,
    logger: EndpointLogger,
    who?: { leadId?: string; ipAddress?: string },
  ): Promise<void> {
    try {
      const startOfToday = PublicCapRepository.startOfToday();
      const now = new Date();
      const [row] = await db
        .update(publicFreeTierDailyCap)
        .set({
          spendToday: sql`CASE WHEN ${publicFreeTierDailyCap.lastResetAt} < ${startOfToday} THEN ${amount} ELSE ${publicFreeTierDailyCap.spendToday} + ${amount} END`,
          lastResetAt: sql`CASE WHEN ${publicFreeTierDailyCap.lastResetAt} < ${startOfToday} THEN ${now} ELSE ${publicFreeTierDailyCap.lastResetAt} END`,
          updatedAt: now,
        })
        .returning({
          spendToday: publicFreeTierDailyCap.spendToday,
          capAmount: publicFreeTierDailyCap.capAmount,
        });

      if (!row) {
        await db.insert(publicFreeTierDailyCap).values({
          capAmount: PublicCapRepository.DEFAULT_CAP,
          spendToday: amount,
        });
        return;
      }

      const before = row.spendToday - amount;
      for (const [pct, kind] of [
        [0.8, "threshold-80"],
        [1, "threshold-100"],
      ] as const) {
        const line = row.capAmount * pct;
        if (before < line && row.spendToday >= line) {
          await PublicCapRepository.recordEvent(
            {
              kind,
              leadId: who?.leadId,
              cost: amount,
              spendToday: row.spendToday,
              capAmount: row.capAmount,
            },
            logger,
          );
        }
      }

      const day = PublicCapRepository.todayString();
      const keys: Array<{ kind: string; key: string }> = [];
      if (who?.leadId) {
        keys.push({ kind: "lead", key: who.leadId });
      }
      if (who?.ipAddress) {
        keys.push({
          kind: "ip",
          key: PublicCapRepository.hashIp(who.ipAddress),
        });
      }
      for (const k of keys) {
        await db
          .insert(publicCapSpenders)
          .values({ day, kind: k.kind, key: k.key, spend: amount })
          .onConflictDoUpdate({
            target: [
              publicCapSpenders.day,
              publicCapSpenders.kind,
              publicCapSpenders.key,
            ],
            set: {
              spend: sql`${publicCapSpenders.spend} + ${amount}`,
              updatedAt: now,
            },
          });
      }
    } catch (error) {
      logger.error("Failed to increment public cap spend", parseError(error));
    }
  }

  /**
   * Pre-generation gate for free-tier pools. Fails CLOSED on any error.
   * Rejects when: pool cap reached, expected cost alone exceeds what is left,
   * or this lead / IP has used its daily sub-cap (suspected abuse, logged).
   *
   * With `reservation`, the check and a reservation of `expectedCost` happen
   * atomically under one advisory lock, counting every live reservation: N
   * parallel requests from one pool / lead / IP can no longer all pass against
   * the same remaining allowance. The pool's next model-usage deduction
   * releases it (settleSpend); an unbilled request's reservation expires.
   */
  static async gate(
    params: PublicCapGateParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PublicCapAllowance>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { leadId, ipAddress, expectedCost, model, reservation, actor } =
      params;
    const ipHash = ipAddress
      ? PublicCapRepository.hashIp(ipAddress)
      : undefined;
    try {
      // Atomic lazy reset: only the first request after midnight matches the WHERE.
      const startOfToday = PublicCapRepository.startOfToday();
      await db
        .update(publicFreeTierDailyCap)
        .set({ spendToday: 0, lastResetAt: new Date(), updatedAt: new Date() })
        .where(sql`${publicFreeTierDailyCap.lastResetAt} < ${startOfToday}`);

      const [existing] = await db
        .select({ id: publicFreeTierDailyCap.id })
        .from(publicFreeTierDailyCap)
        .limit(1);
      if (!existing) {
        const created = await this.getOrCreateRow(logger, t);
        if (!created.success) {
          return fail({
            message: t("repository.capUnavailable"),
            errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
          });
        }
      }

      const day = PublicCapRepository.todayString();
      const now = new Date();
      // Events are written after the transaction: never a second connection
      // while the advisory lock is held.
      const outcome = await db.transaction(async (tx) => {
        if (reservation) {
          await tx.execute(
            sql`SELECT pg_advisory_xact_lock(${RESERVATION_LOCK_KEY})`,
          );
        }
        const [row] = await tx.select().from(publicFreeTierDailyCap).limit(1);
        if (!row) {
          return {
            ok: false as const,
            refusal: "capUnavailable" as const,
            scope: undefined,
            left: 0,
          };
        }

        const spenders = await tx
          .select()
          .from(publicCapSpenders)
          .where(
            and(
              eq(publicCapSpenders.day, day),
              or(
                leadId
                  ? and(
                      eq(publicCapSpenders.kind, "lead"),
                      eq(publicCapSpenders.key, leadId),
                    )
                  : undefined,
                ipHash
                  ? and(
                      eq(publicCapSpenders.kind, "ip"),
                      eq(publicCapSpenders.key, ipHash),
                    )
                  : undefined,
              ),
            ),
          );
        const leadSpend =
          spenders.find((s) => s.kind === "lead" && s.key === leadId)?.spend ??
          0;
        const ipSpend =
          spenders.find((s) => s.kind === "ip" && s.key === ipHash)?.spend ?? 0;

        // Live reservations of requests still in flight (zero without reservation).
        const [held] = reservation
          ? await tx
              .select({
                all: sql<string>`coalesce(sum(${publicCapReservations.amount}), 0)`,
                pool: sql<string>`coalesce(sum(${publicCapReservations.amount}) FILTER (WHERE ${publicCapReservations.poolKey} = ${reservation.poolKey}), 0)`,
                lead: leadId
                  ? sql<string>`coalesce(sum(${publicCapReservations.amount}) FILTER (WHERE ${publicCapReservations.leadId} = ${leadId}), 0)`
                  : sql<string>`0`,
                ip: ipHash
                  ? sql<string>`coalesce(sum(${publicCapReservations.amount}) FILTER (WHERE ${publicCapReservations.ipHash} = ${ipHash}), 0)`
                  : sql<string>`0`,
              })
              .from(publicCapReservations)
              .where(gt(publicCapReservations.expiresAt, now))
          : [undefined];
        const reserved = {
          all: Number(held?.all ?? 0),
          pool: Number(held?.pool ?? 0),
          lead: Number(held?.lead ?? 0),
          ip: Number(held?.ip ?? 0),
        };

        const spendToday = row.spendToday + reserved.all;
        const base = {
          leadId,
          ipHash,
          model,
          cost: expectedCost,
          spendToday,
          capAmount: row.capAmount,
          actor,
          evidence: {
            poolSettledToday: row.spendToday,
            poolReservedLive: reserved.all,
            leadSettledToday: leadId ? leadSpend : undefined,
            leadReservedLive: leadId ? reserved.lead : undefined,
            ipSettledToday: ipHash ? ipSpend : undefined,
            ipReservedLive: ipHash ? reserved.ip : undefined,
            walletPoolKey: reservation?.poolKey,
            walletSpendable: reservation?.spendable,
            walletReservedLive: reservation ? reserved.pool : undefined,
          },
        };

        const leadUsed = leadSpend + reserved.lead;
        const ipUsed = ipSpend + reserved.ip;
        const poolLeft = row.capAmount - spendToday;
        // What this caller could still spend today under every ceiling.
        const callerLeft = Math.max(
          0,
          Math.min(
            poolLeft,
            leadId ? row.perLeadCap - leadUsed : poolLeft,
            ipHash ? row.perIpCap - ipUsed : poolLeft,
          ),
        );

        if (spendToday >= row.capAmount) {
          return {
            ok: false as const,
            refusal: "capExceeded" as const,
            scope: "pool" as const,
            left: 0,
            event: { kind: "global-cap" as const, ...base },
          };
        }
        // Single-request clamp: one generation must not blow the remaining pool.
        if (expectedCost > poolLeft) {
          return {
            ok: false as const,
            refusal: "capExceeded" as const,
            scope: "pool" as const,
            left: callerLeft,
            event: { kind: "single-request" as const, ...base },
          };
        }
        if (leadId && leadUsed + expectedCost > row.perLeadCap) {
          // spendToday/capAmount are the shared pool; name the lead's own
          // spend and sub-cap, or the refusal looks like a bug.
          return {
            ok: false as const,
            refusal: "leadCapExceeded" as const,
            scope: "caller" as const,
            left: callerLeft,
            event: {
              kind: "lead-cap" as const,
              ...base,
              subCapSpend: leadUsed,
              subCap: row.perLeadCap,
            },
          };
        }
        if (ipHash && ipUsed + expectedCost > row.perIpCap) {
          return {
            ok: false as const,
            refusal: "leadCapExceeded" as const,
            scope: "caller" as const,
            left: callerLeft,
            event: {
              kind: "ip-cap" as const,
              ...base,
              subCapSpend: ipUsed,
              subCap: row.perIpCap,
            },
          };
        }
        const walletLeft =
          reservation?.spendable === undefined
            ? undefined
            : reservation.spendable - reserved.pool;
        if (walletLeft !== undefined && expectedCost > walletLeft) {
          return {
            ok: false as const,
            refusal: "reservedByRunningReply" as const,
            scope: "inFlight" as const,
            left: Math.max(0, Math.min(callerLeft, walletLeft)),
            event: {
              kind: "pool-reserved" as const,
              ...base,
              subCapSpend: reserved.pool,
              subCap: reservation?.spendable,
            },
          };
        }

        if (reservation) {
          await tx.insert(publicCapReservations).values({
            poolKey: reservation.poolKey,
            leadId: leadId ?? null,
            ipHash: ipHash ?? null,
            amount: expectedCost,
            expiresAt: new Date(now.getTime() + RESERVATION_TTL_MS),
          });
        }

        const poolRemaining = row.capAmount - spendToday;
        const capRemaining = Math.min(
          poolRemaining,
          leadId ? row.perLeadCap - leadUsed : poolRemaining,
          ipHash ? row.perIpCap - ipUsed : poolRemaining,
        );
        return {
          ok: true as const,
          remaining:
            walletLeft === undefined
              ? capRemaining
              : Math.min(capRemaining, walletLeft),
          limitedByPool: capRemaining === poolRemaining,
        };
      });

      if (!outcome.ok) {
        if (outcome.event) {
          await PublicCapRepository.recordEvent(outcome.event, logger);
        }
        return fail({
          message: t(`repository.${outcome.refusal}`),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
          allowance: outcome.scope
            ? {
                scope: outcome.scope,
                remaining: roundCredits(outcome.left),
                resetsAt: PublicCapRepository.nextReset().toISOString(),
              }
            : undefined,
        });
      }
      return success({
        remaining: outcome.remaining,
        limitMessage: outcome.limitedByPool
          ? t("repository.capExceeded")
          : t("repository.leadCapExceeded"),
      });
    } catch (error) {
      // FAIL CLOSED: never allow unbounded free spend because the cap is unreadable.
      logger.error(
        "[PublicCap] cap read failed - blocking free request (fail closed)",
        parseError(error),
        { leadId, model },
      );
      return fail({
        message: t("repository.capUnavailable"),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }
  }

  /**
   * Free model usage was billed for `poolKey`: record the spend, then release
   * the pool's oldest live reservation (and drop expired ones). Never throws.
   */
  static async settleSpend(
    amount: number,
    logger: EndpointLogger,
    who: { leadId?: string; ipAddress?: string; poolKey?: string },
  ): Promise<void> {
    if (amount > 0) {
      await PublicCapRepository.incrementSpend(amount, logger, who);
    }
    if (!who.poolKey) {
      return;
    }
    try {
      const now = new Date();
      await db
        .delete(publicCapReservations)
        .where(
          or(
            lt(publicCapReservations.expiresAt, now),
            eq(
              publicCapReservations.id,
              sql`(SELECT ${publicCapReservations.id} FROM ${publicCapReservations} WHERE ${publicCapReservations.poolKey} = ${who.poolKey} AND ${publicCapReservations.expiresAt} >= ${now} ORDER BY ${publicCapReservations.createdAt} LIMIT 1)`,
            ),
          ),
        );
    } catch (error) {
      logger.error(
        "[PublicCap] failed to release free-tier reservation",
        parseError(error),
        { poolKey: who.poolKey },
      );
    }
  }
}
