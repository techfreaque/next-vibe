/**
 * Purchase Order Create Repository
 * Creates a new purchase order in Draft status with auto-generated PO number
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { purchaseOrders } from "../../db";
import { scopedTranslation } from "../../i18n";
import { validOrderReferences } from "../draft";
import type {
  OrderCreateRequestOutput,
  OrderCreateResponseOutput,
} from "./definition";

export class OrderCreateRepository {
  static async createOrder(
    userId: string,
    data: OrderCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Auth check
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderCreate.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        const [company] = await tx
          .select({ id: companies.id })
          .from(companies)
          .where(
            and(eq(companies.id, data.companyId), eq(companies.isActive, true)),
          )
          .for("update");
        if (
          !company ||
          !(await validOrderReferences(tx, data.companyId, userId, {
            vendorId: data.vendorId,
            warehouseId: data.deliveryWarehouseId,
          }))
        ) {
          return fail({
            message: t("orderCreate.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const yearPrefix = `PO-${new Date().getUTCFullYear()}-`;
        const [next] = await tx
          .select({
            value: sql<string>`coalesce(max(substring(${purchaseOrders.poNumber} from ${`^${yearPrefix}([0-9]+)$`})::numeric),0)+1`,
          })
          .from(purchaseOrders)
          .where(eq(purchaseOrders.companyId, data.companyId));
        const poNumber = `${yearPrefix}${String(next.value).padStart(4, "0")}`;
        const [created] = await tx
          .insert(purchaseOrders)
          .values({
            companyId: data.companyId,
            vendorId: data.vendorId,
            poNumber,
            status: "DRAFT",
            currency: data.currency,
            expectedDeliveryDate: data.expectedDeliveryDate ?? null,
            deliveryWarehouseId: data.deliveryWarehouseId ?? null,
            notes: data.notes ?? null,
            subtotal: 0,
            taxAmount: 0,
            total: 0,
            createdByUserId: userId,
          })
          .returning();

        if (!created) {
          return fail({
            message: t("orderCreate.post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        logger.info("Purchase order created", {
          poId: created.id,
          poNumber: created.poNumber,
        });

        return success({
          result: {
            currency: created.currency,
            id: created.id,
            poNumber: created.poNumber,
            status: created.status,
            subtotal: created.subtotal,
            taxAmount: created.taxAmount,
            total: created.total,
            createdAt: created.createdAt,
          },
        });
      });
    } catch (error) {
      logger.error("Failed to create purchase order", parseError(error));
      return fail({
        message: t("orderCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
