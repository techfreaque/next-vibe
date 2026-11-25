import "server-only";

import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { warehouses } from "@/inventory/db";
import { catalogProducts } from "@/products/db";
import { TaxCalculator } from "@/tax/calculator";

import { purchaseOrderLines, purchaseOrders, purchasingVendors } from "../db";

type PurchaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Order = typeof purchaseOrders.$inferSelect;
export async function withDraftOrder<T>(
  poId: string,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  messages: { notFound: TranslatedKeyType; conflict: TranslatedKeyType },
  operate: (tx: PurchaseTransaction, order: Order) => Promise<ResponseType<T>>,
): Promise<ResponseType<T>> {
  const [owner] = await db
    .select({ companyId: purchaseOrders.companyId })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, poId));
  if (!owner) {
    return fail({
      message: messages.notFound,
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }
  const access = await CompanyAuthRepository.requireMember(
    userId,
    owner.companyId,
    CompanyMemberRole.MEMBER,
    logger,
    locale,
  );
  if (!access.success) {
    return access;
  }
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(purchaseOrders)
      .where(
        and(
          eq(purchaseOrders.id, poId),
          eq(purchaseOrders.companyId, owner.companyId),
        ),
      )
      .for("update");
    if (!order || order.status !== "DRAFT") {
      return fail({
        message: messages.conflict,
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    return operate(tx, order);
  });
}

export async function validOrderReferences(
  tx: PurchaseTransaction,
  companyId: string,
  userId: string,
  refs: {
    vendorId?: string | null;
    warehouseId?: string | null;
    productIds?: readonly string[];
  },
): Promise<boolean> {
  if (refs.vendorId) {
    const [vendor] = await tx
      .select({ id: purchasingVendors.id })
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.id, refs.vendorId),
          eq(purchasingVendors.companyId, companyId),
          eq(purchasingVendors.isActive, true),
        ),
      )
      .for("share");
    if (!vendor) {
      return false;
    }
  }
  if (refs.warehouseId) {
    const [warehouse] = await tx
      .select({ id: warehouses.id })
      .from(warehouses)
      .where(
        and(
          eq(warehouses.id, refs.warehouseId),
          eq(warehouses.companyId, companyId),
          eq(warehouses.isActive, true),
        ),
      )
      .for("share");
    if (!warehouse) {
      return false;
    }
  }
  const ids = [...new Set(refs.productIds)];
  if (!ids.length) {
    return true;
  }
  const products = await tx
    .select({ id: catalogProducts.id })
    .from(catalogProducts)
    .where(
      and(
        inArray(catalogProducts.id, ids),
        or(
          eq(catalogProducts.companyId, companyId),
          and(
            isNull(catalogProducts.companyId),
            eq(catalogProducts.ownerUserId, userId),
          ),
        ),
      ),
    )
    .for("share");
  return products.length === ids.length;
}

export function purchaseLineAmounts(line: {
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}): { taxAmount: number; lineTotal: number } | null {
  const taxRate = line.taxRate ?? 0;
  if (
    line.quantity <= 0 ||
    line.unitPrice < 0 ||
    taxRate < 0 ||
    taxRate > 1 ||
    [line.quantity, line.unitPrice, taxRate].some((value) => {
      const units = Math.round(value * 10_000);
      return (
        !Number.isSafeInteger(units) ||
        units >= 1_000_000_000_000 ||
        units / 10_000 !== value
      );
    })
  ) {
    return null;
  }
  const { taxAmount, total } = TaxCalculator.calculateLineItemTax({
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    taxRate,
  });
  return total < 100_000_000 ? { taxAmount, lineTotal: total } : null;
}

export async function purchaseTotals(
  tx: PurchaseTransaction,
  poId: string,
): Promise<{ subtotal: number; taxAmount: number; total: number }> {
  const [result] = await tx
    .select({
      subtotal:
        sql<number>`coalesce(sum(${purchaseOrderLines.lineTotal}-${purchaseOrderLines.taxAmount}),0)`.mapWith(
          Number,
        ),
      taxAmount:
        sql<number>`coalesce(sum(${purchaseOrderLines.taxAmount}),0)`.mapWith(
          Number,
        ),
      total:
        sql<number>`coalesce(sum(${purchaseOrderLines.lineTotal}),0)`.mapWith(
          Number,
        ),
    })
    .from(purchaseOrderLines)
    .where(eq(purchaseOrderLines.poId, poId));
  return result;
}
