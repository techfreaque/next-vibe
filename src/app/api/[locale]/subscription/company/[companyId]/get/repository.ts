/**
 * Company Subscription Get Repository
 * Returns the active subscription for a company's owner.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import type { CompanySubscriptionGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompanySubscriptionGetRepository {
  static async getCompanySubscription(
    companyId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanySubscriptionGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      // Find the company owner and return their subscription
      const [owner] = await db
        .select({ userId: companyMembers.userId })
        .from(companyMembers)
        .where(eq(companyMembers.companyId, companyId))
        .limit(1);

      if (!owner) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, owner.userId))
        .limit(1);

      if (!sub) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        id: sub.id,
        plan: sub.planId,
        billingInterval: sub.billingInterval,
        status: sub.status,
        currentPeriodStart:
          sub.currentPeriodStart?.toISOString() ?? new Date().toISOString(),
        currentPeriodEnd:
          sub.currentPeriodEnd?.toISOString() ?? new Date().toISOString(),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        cancelAt: sub.cancelAt?.toISOString() ?? undefined,
        canceledAt: sub.canceledAt?.toISOString() ?? undefined,
        endedAt: sub.endedAt?.toISOString() ?? undefined,
        provider: sub.provider,
        providerSubscriptionId: sub.providerSubscriptionId ?? undefined,
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Failed to get company subscription", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
