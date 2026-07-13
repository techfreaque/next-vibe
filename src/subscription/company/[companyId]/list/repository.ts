/**
 * Company Subscription List Repository
 * Returns all subscriptions associated with company members
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { subscriptions } from "@/app/api/[locale]/subscription/db";

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
          currentPeriodStart: sub.currentPeriodStart ?? new Date(),
          currentPeriodEnd: sub.currentPeriodEnd ?? new Date(),
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          cancelAt: sub.cancelAt ?? undefined,
          canceledAt: sub.canceledAt ?? undefined,
          endedAt: sub.endedAt ?? undefined,
          provider: sub.provider,
          providerSubscriptionId: sub.providerSubscriptionId ?? undefined,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
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
