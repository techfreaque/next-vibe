/**
 * Purchase Order Confirm Repository
 * Transitions a Sent PO to Confirmed
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";

interface OrderConfirmResult {
  result: { id: string; status: string; confirmedAt: Date };
}

export class OrderConfirmRepository {
  static async confirmOrder(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderConfirmResult>> {
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
          message: t("orderConfirm.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.status !== "SENT") {
        return fail({
          message: t("orderConfirm.post.errors.conflict.title"),
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
          message: t("orderConfirm.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const now = new Date();
      const [updated] = await db
        .update(purchaseOrders)
        .set({ status: "CONFIRMED", confirmedAt: now, updatedAt: now })
        .where(eq(purchaseOrders.id, poId))
        .returning({
          id: purchaseOrders.id,
          status: purchaseOrders.status,
          confirmedAt: purchaseOrders.confirmedAt,
        });

      if (!updated || !updated.confirmedAt) {
        return fail({
          message: t("orderConfirm.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Purchase order confirmed", { poId });

      return success({
        result: {
          id: updated.id,
          status: updated.status,
          confirmedAt: updated.confirmedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to confirm purchase order", parseError(error));
      return fail({
        message: t("orderConfirm.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
