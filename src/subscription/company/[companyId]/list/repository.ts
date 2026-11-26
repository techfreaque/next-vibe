/**
 * Company Subscription List Repository
 * Shows the authorized company owner's account subscription.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { readCompanyOwnerBilling } from "../owner-billing";
import type { CompanySubscriptionListResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompanySubscriptionListRepository {
  static async listCompanySubscriptions(
    companyId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanySubscriptionListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const billing = await readCompanyOwnerBilling(companyId, userId);
      if (!billing) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const sub = billing.subscription;
      return success({
        selectedCompanyId: companyId,
        companyName: billing.companyName,
        subscriptions: sub
          ? [
              {
                id: sub.id,
                plan: sub.planId,
                billingInterval: sub.billingInterval,
                status: sub.status,
                currentPeriodStart: sub.currentPeriodStart,
                currentPeriodEnd: sub.currentPeriodEnd,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
                cancelAt: sub.cancelAt ?? undefined,
                canceledAt: sub.canceledAt ?? undefined,
                endedAt: sub.endedAt ?? undefined,
                provider: sub.provider,
                providerSubscriptionId: sub.providerSubscriptionId ?? undefined,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
              },
            ]
          : [],
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
