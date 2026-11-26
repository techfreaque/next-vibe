/**
 * Company Subscription Get Repository
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
import type { CompanySubscriptionGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CompanySubscriptionGetRepository {
  static async getCompanySubscription(
    companyId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanySubscriptionGetResponseOutput>> {
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
        currentPeriodStart: sub?.currentPeriodStart ?? null,
        currentPeriodEnd: sub?.currentPeriodEnd ?? null,
        ...(sub
          ? {
              id: sub.id,
              plan: sub.planId,
              billingInterval: sub.billingInterval,
              status: sub.status,
              cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
              cancelAt: sub.cancelAt?.toISOString(),
              canceledAt: sub.canceledAt?.toISOString(),
              endedAt: sub.endedAt?.toISOString(),
              provider: sub.provider,
              providerSubscriptionId: sub.providerSubscriptionId ?? undefined,
              createdAt: sub.createdAt,
              updatedAt: sub.updatedAt,
            }
          : {}),
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
