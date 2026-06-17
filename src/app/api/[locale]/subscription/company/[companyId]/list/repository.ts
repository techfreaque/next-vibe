/**
 * Company Subscription List Repository
 * Returns all subscriptions associated with company members
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

import type { CompanySubscriptionListResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompanySubscriptionListRepository {
  static async listCompanySubscriptions(
    companyId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanySubscriptionListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const members = await db
        .select({ userId: companyMembers.userId })
        .from(companyMembers)
        .where(eq(companyMembers.companyId, companyId));

      if (members.length === 0) {
        return success({ subscriptions: [] });
      }

      const userIds = members.map((m) => m.userId);

      const subs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userIds[0] ?? ""));

      return success({
        subscriptions: subs.map((sub) => ({
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
        })),
      });
    } catch (error) {
      logger.error("Failed to list company subscriptions", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
