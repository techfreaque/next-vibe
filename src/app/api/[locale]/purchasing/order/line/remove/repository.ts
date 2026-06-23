/**
 * Purchase Order Line Remove Repository
 * Deletes a line item and recalculates PO subtotal/taxAmount/total
 */

import "server-only";

import { and, eq, sum } from "drizzle-orm";
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
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchaseOrderLines, purchaseOrders } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { OrderLineRemoveResponseOutput } from "./definition";

export class OrderLineRemoveRepository {
  static async removeLine(
    poId: string,
    lineId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderLineRemoveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderLineRemove.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.status !== "DRAFT") {
        return fail({
          message: t("orderLineRemove.post.errors.conflict.title"),
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
          message: t("orderLineRemove.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Verify the line belongs to this PO
      const [line] = await db
        .select({ id: purchaseOrderLines.id })
        .from(purchaseOrderLines)
        .where(
          and(
            eq(purchaseOrderLines.id, lineId),
            eq(purchaseOrderLines.poId, poId),
          ),
        )
        .limit(1);

      if (!line) {
        return fail({
          message: t("orderLineRemove.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Delete the line
      await db
        .delete(purchaseOrderLines)
        .where(eq(purchaseOrderLines.id, lineId));

      // Recalculate PO totals from remaining lines
      const totals = await db
        .select({
          subtotal: sum(purchaseOrderLines.lineTotal),
          taxAmount: sum(purchaseOrderLines.taxAmount),
        })
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId));

      const rawSubtotal = Number(totals[0]?.subtotal ?? 0);
      const rawTaxAmount = Number(totals[0]?.taxAmount ?? 0);
      const newSubtotal = rawSubtotal - rawTaxAmount;
      const newTaxAmount = rawTaxAmount;
      const newTotal = rawSubtotal;

      await db
        .update(purchaseOrders)
        .set({
          subtotal: newSubtotal,
          taxAmount: newTaxAmount,
          total: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(purchaseOrders.id, poId));

      logger.info("Line removed from purchase order", { poId, lineId });

      return success({
        result: {
          subtotal: newSubtotal,
          taxAmount: newTaxAmount,
          total: newTotal,
        },
      });
    } catch (error) {
      logger.error("Failed to remove line from PO", parseError(error));
      return fail({
        message: t("orderLineRemove.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
