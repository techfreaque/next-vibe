/**
 * Business Overview Repository
 *
 * Composes the overview from the domain-owned summary functions. A failing
 * section is logged and returned as null so the rest still renders.
 */

import "server-only";

import { min } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { getOpsOverview } from "next-vibe/logger/error-monitor/overview";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";

import { getAcquisitionOverview } from "@/leads/analytics/overview";
import { getMoneyOverview } from "@/payment/analytics/overview";
import { getReferralOverview } from "@/referral/analytics/overview";

import type {
  BusinessOverviewRequestOutput,
  BusinessOverviewResponseOutput,
} from "./definition";
import type { BusinessOverviewT } from "./i18n";

async function section<TData>(
  name: string,
  load: () => Promise<ResponseType<TData>>,
  logger: EndpointLogger,
): Promise<TData | null> {
  const started = Date.now();
  try {
    const result = await load();
    logger.debug(
      `Business overview section ${name} took ${Date.now() - started}ms`,
    );
    if (result.success) {
      return result.data;
    }
    logger.error(`Business overview section failed: ${name}`, {
      message: result.message,
    });
    return null;
  } catch (error) {
    logger.error(
      `Business overview section crashed: ${name}`,
      parseError(error),
    );
    return null;
  }
}

/** Short cache: the overview is opened often and every section is an aggregate. */
const CACHE_TTL_MS = 60_000;
const overviewCache = new Map<
  string,
  { at: number; data: BusinessOverviewResponseOutput }
>();

export class BusinessOverviewRepository {
  static async getOverview(
    data: BusinessOverviewRequestOutput,
    logger: EndpointLogger,
    t: BusinessOverviewT,
    locale: CountryLanguage,
  ): Promise<ResponseType<BusinessOverviewResponseOutput>> {
    try {
      const [floor] = await db
        .select({ first: min(leads.createdAt) })
        .from(leads);
      const win = resolveAnalyticsWindow(data, new Date(), floor?.first);
      const cacheKey = `${locale}|${win.from.toISOString()}|${win.to.toISOString()}|${win.bucket}`;
      const cached = overviewCache.get(cacheKey);
      if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        return success(cached.data);
      }

      const [acquisition, referral, money, ops] = await Promise.all([
        section(
          "acquisition",
          () => getAcquisitionOverview(win, logger, locale),
          logger,
        ),
        section("referral", () => getReferralOverview(win, logger), logger),
        section("money", () => getMoneyOverview(win, logger, locale), logger),
        section("ops", () => getOpsOverview(win, logger), logger),
      ]);

      const result: BusinessOverviewResponseOutput = {
        window: serializeWindow(win),
        generatedAt: new Date().toISOString(),
        acquisition,
        referral,
        money,
        ops,
      };
      if (acquisition && referral && money && ops) {
        overviewCache.set(cacheKey, { at: Date.now(), data: result });
        if (overviewCache.size > 50) {
          const oldest = overviewCache.keys().next().value;
          if (oldest !== undefined) {
            overviewCache.delete(oldest);
          }
        }
      }
      return success(result);
    } catch (error) {
      logger.error("Business overview failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
