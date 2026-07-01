/**
 * Purchase Order Cancel Repository
 * Cancels a Draft or Sent PO
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";

interface OrderCancelResult {
  result: { id: string; status: string };
}

export class OrderCancelRepository {
  static async cancelOrder(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderCancelResult>> {
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
          message: t("orderCancel.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const cancellableStatuses = ["DRAFT", "SENT"];
      if (!cancellableStatuses.includes(po.status)) {
        return fail({
          message: t("orderCancel.post.errors.conflict.title"),
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
          message: t("orderCancel.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [updated] = await db
        .update(purchaseOrders)
        .set({ status: "CANCELLED", updatedAt: new Date() })
        .where(eq(purchaseOrders.id, poId))
        .returning({ id: purchaseOrders.id, status: purchaseOrders.status });

      if (!updated) {
        return fail({
          message: t("orderCancel.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Purchase order cancelled", { poId });

      return success({
        result: { id: updated.id, status: updated.status },
      });
    } catch (error) {
      logger.error("Failed to cancel purchase order", parseError(error));
      return fail({
        message: t("orderCancel.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
