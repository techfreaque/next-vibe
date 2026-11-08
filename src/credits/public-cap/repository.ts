import "server-only";

import { createHash } from "node:crypto";

import { desc, eq, sql } from "drizzle-orm";
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

import {
  publicCapEvents,
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
  | "threshold-80"
  | "threshold-100";

export interface PublicCapGateParams {
  leadId: string | undefined;
  ipAddress: string | undefined;
  /** Expected cost of the request (model cost at default token estimate) */
  expectedCost: number;
  model: string;
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

  private static async recordEvent(
    event: {
      kind: PublicCapEventKind;
      leadId?: string;
      ipHash?: string;
      model?: string;
      cost: number;
      spendToday: number;
      capAmount: number;
    },
    logger: EndpointLogger,
  ): Promise<void> {
    logger.warn("[PublicCap] event", { ...event });
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
   */
  static async gate(
    params: PublicCapGateParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { leadId, ipAddress, expectedCost, model } = params;
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

      const [row] = await db.select().from(publicFreeTierDailyCap).limit(1);
      if (!row) {
        // No row yet means no spend yet - allow (first-ever call seeds on increment)
        return success(undefined);
      }

      const base = {
        leadId,
        ipHash,
        model,
        cost: expectedCost,
        spendToday: row.spendToday,
        capAmount: row.capAmount,
      };

      if (row.spendToday >= row.capAmount) {
        await PublicCapRepository.recordEvent(
          { kind: "global-cap", ...base },
          logger,
        );
        return fail({
          message: t("repository.capExceeded"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      // Single-request clamp: one generation must not blow the remaining pool.
      if (expectedCost > row.capAmount - row.spendToday) {
        await PublicCapRepository.recordEvent(
          { kind: "single-request", ...base },
          logger,
        );
        return fail({
          message: t("repository.capExceeded"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      const day = PublicCapRepository.todayString();
      const spenders = await db
        .select()
        .from(publicCapSpenders)
        .where(eq(publicCapSpenders.day, day));
      const leadSpend =
        spenders.find((s) => s.kind === "lead" && s.key === leadId)?.spend ?? 0;
      const ipSpend =
        spenders.find((s) => s.kind === "ip" && s.key === ipHash)?.spend ?? 0;

      if (leadId && leadSpend + expectedCost > row.perLeadCap) {
        await PublicCapRepository.recordEvent(
          { kind: "lead-cap", ...base },
          logger,
        );
        return fail({
          message: t("repository.leadCapExceeded"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }
      if (ipHash && ipSpend + expectedCost > row.perIpCap) {
        await PublicCapRepository.recordEvent(
          { kind: "ip-cap", ...base },
          logger,
        );
        return fail({
          message: t("repository.leadCapExceeded"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      return success(undefined);
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
}
