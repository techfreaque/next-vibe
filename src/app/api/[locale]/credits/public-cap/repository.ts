import "server-only";

import { eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { publicFreeTierDailyCap } from "./db";
import type {
  PublicCapGetResponseOutput,
  PublicCapPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import type { PublicCapT } from "./i18n";

/** YYYY-MM-DD string for today in server local time */
export class PublicCapRepository {
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
        // First ever call — seed the row
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
   * GET handler — returns current status for admin view.
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

    return success({
      spendToday: row.spendToday,
      capAmount: row.capAmount,
      remainingToday: remaining,
      percentUsed,
      lastResetAt: row.lastResetAt.toISOString(),
      capExceeded: row.spendToday >= row.capAmount,
    });
  }

  /**
   * POST handler — update the cap amount.
   */
  static async updateCap(
    capAmount: number,
    logger: EndpointLogger,
    t: PublicCapT,
  ): Promise<ResponseType<PublicCapPostResponseOutput>> {
    try {
      const rowResult = await this.getOrCreateRow(logger, t);
      if (!rowResult.success) {
        return rowResult;
      }

      await db
        .update(publicFreeTierDailyCap)
        .set({ capAmount, updatedAt: new Date() })
        .where(eq(publicFreeTierDailyCap.id, rowResult.data.id));

      return success({
        message: `Daily cap updated to ${capAmount} credits`,
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
   * Called from CreditRepository.deductCredits() after a successful free-tier deduction.
   * Increments spendToday. Also performs lazy reset if needed.
   * Race conditions intentionally ignored.
   */
  static async incrementSpend(
    amount: number,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const [row] = await db.select().from(publicFreeTierDailyCap).limit(1);

      if (!row) {
        // Seed row if missing (shouldn't happen but be safe)
        await db.insert(publicFreeTierDailyCap).values({
          capAmount: PublicCapRepository.DEFAULT_CAP,
          spendToday: amount,
        });
        return;
      }

      // Lazy midnight reset
      const resetDate = row.lastResetAt.toISOString().slice(0, 10);
      if (resetDate !== PublicCapRepository.todayString()) {
        await db
          .update(publicFreeTierDailyCap)
          .set({
            spendToday: amount,
            lastResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(publicFreeTierDailyCap.id, row.id));
        return;
      }

      await db
        .update(publicFreeTierDailyCap)
        .set({
          spendToday: sql`${publicFreeTierDailyCap.spendToday} + ${amount}`,
          updatedAt: new Date(),
        })
        .where(eq(publicFreeTierDailyCap.id, row.id));
    } catch (error) {
      // Non-fatal — log and continue, don't fail the credit deduction
      logger.error("Failed to increment public cap spend", parseError(error));
    }
  }

  /**
   * Check if the global daily cap is exceeded.
   * Returns fail() with user-friendly message if cap is hit.
   * Also performs lazy midnight reset.
   */
  static async checkCap(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [row] = await db.select().from(publicFreeTierDailyCap).limit(1);

      if (!row) {
        // No row yet means no spend yet — allow
        return success(undefined);
      }

      // Lazy midnight reset
      const resetDate = row.lastResetAt.toISOString().slice(0, 10);
      if (resetDate !== PublicCapRepository.todayString()) {
        // New day — reset and allow
        await db
          .update(publicFreeTierDailyCap)
          .set({
            spendToday: 0,
            lastResetAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(publicFreeTierDailyCap.id, row.id));
        return success(undefined);
      }

      if (row.spendToday >= row.capAmount) {
        return fail({
          message: t("repository.capExceeded"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success(undefined);
    } catch (error) {
      logger.error("Failed to check public cap", parseError(error));
      // On error, allow — don't block users due to cap check failure
      return success(undefined);
    }
  }
}
