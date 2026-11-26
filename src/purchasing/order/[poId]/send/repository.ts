/**
 * Purchase Order Send Repository
 * Transitions a Draft PO to Sent
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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

import { purchaseOrderLines, purchaseOrders } from "../../../db";
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

      const [line] = await db
        .select({ id: purchaseOrderLines.id })
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId))
        .limit(1);
      if (!line) {
        return fail({
          message: t("orderSend.post.widget.noLines"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const [updated] = await db
        .update(purchaseOrders)
        .set({ status: "SENT", updatedAt: new Date() })
        .where(
          and(
            eq(purchaseOrders.id, poId),
            eq(purchaseOrders.companyId, po.companyId),
            inArray(purchaseOrders.status, ["DRAFT"]),
          ),
        )
        .returning({ id: purchaseOrders.id, status: purchaseOrders.status });

      if (!updated) {
        return fail({
          message: t("orderSend.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
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
