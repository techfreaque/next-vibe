/**
 * Purchase Order Send Repository
 * Transitions a Draft PO to Sent
 */

import "server-only";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";

interface OrderSendResult {
  result: { id: string; status: string };
}

export class OrderSendRepository {
  static async sendOrder(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderSendResult>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select({
          id: purchaseOrders.id,
          companyId: purchaseOrders.companyId,
          status: purchaseOrders.status,
        })
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderSend.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.status !== "DRAFT") {
        return fail({
          message: t("orderSend.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        po.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderSend.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [updated] = await db
        .update(purchaseOrders)
        .set({ status: "SENT", updatedAt: new Date() })
        .where(eq(purchaseOrders.id, poId))
        .returning({ id: purchaseOrders.id, status: purchaseOrders.status });

      if (!updated) {
        return fail({
          message: t("orderSend.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Purchase order sent", { poId });

      return success({
        result: { id: updated.id, status: updated.status },
      });
    } catch (error) {
      logger.error("Failed to send purchase order", parseError(error));
      return fail({
        message: t("orderSend.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
