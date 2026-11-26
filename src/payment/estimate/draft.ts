import "server-only";

import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";

import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { catalogProducts } from "@/products/db";
import { TaxCalculator } from "@/tax/calculator";
import type { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { paymentEstimateLines, paymentEstimates } from "../db";
import { calculateInvoiceLine } from "../invoice/line/amounts";

export function estimateLine(
  line: {
    description: string;
    productId?: string | null;
    quantity?: number;
    unitPrice: number;
    taxRate?: number;
    sortOrder?: number;
  },
  index: number,
  settlement?: typeof LINE_SETTLEMENT_V1,
):
  | (ReturnType<typeof calculateInvoiceLine> & {
      description: string;
      productId: string | null;
      sortOrder: number;
    })
  | null {
  const quantity = line.quantity ?? 1;
  const taxRate = line.taxRate ?? 0;
  if (
    !line.description.trim() ||
    quantity <= 0 ||
    line.unitPrice < 0 ||
    taxRate < 0 ||
    taxRate > 1 ||
    ![quantity, line.unitPrice, taxRate].every(
      (value) =>
        Number.isFinite(value) &&
        value < 100_000_000 &&
        TaxCalculator.roundToFour(value) === value,
    )
  ) {
    return null;
  }
  const amounts = calculateInvoiceLine(
    {
      quantity,
      unitPrice: line.unitPrice,
      taxRate,
    },
    settlement,
  );
  if (amounts.lineTotal >= 100_000_000) {
    return null;
  }
  return {
    description: line.description.trim(),
    productId: line.productId ?? null,
    sortOrder: line.sortOrder ?? index,
    ...amounts,
  };
}

export async function estimateProductScope(
  tx: LedgerTransaction,
  companyId: string,
  userId: string,
  productIds: readonly string[],
): Promise<boolean> {
  const ids = [...new Set(productIds)];
  if (ids.length === 0) {
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

/** The caller holds the company lock before allocating the next number. */
export async function nextEstimateNumber(
  tx: LedgerTransaction,
  companyId: string,
): Promise<string> {
  const prefix = `EST-${new Date().getUTCFullYear()}-`;
  const [row] = await tx
    .select({
      next: sql<string>`(coalesce(max(substring(${paymentEstimates.estimateNumber} from '[0-9]+$')::numeric),0)+1)::text`,
    })
    .from(paymentEstimates)
    .where(
      and(
        eq(paymentEstimates.companyId, companyId),
        sql`${paymentEstimates.estimateNumber} ~ ${`^${prefix}[0-9]+$`}`,
      ),
    );
  return prefix + (row?.next ?? "1").padStart(4, "0");
}

/** Aggregate stored line amounts so the draft agrees with its eventual invoice. */
export async function refreshEstimateTotals(
  tx: LedgerTransaction,
  estimateId: string,
): Promise<void> {
  const [totals] = await tx
    .select({
      subtotal:
        sql<number>`coalesce(sum(${paymentEstimateLines.lineTotal}-${paymentEstimateLines.taxAmount}),0)`.mapWith(
          Number,
        ),
      taxAmount:
        sql<number>`coalesce(sum(${paymentEstimateLines.taxAmount}),0)`.mapWith(
          Number,
        ),
      total:
        sql<number>`coalesce(sum(${paymentEstimateLines.lineTotal}),0)`.mapWith(
          Number,
        ),
    })
    .from(paymentEstimateLines)
    .where(eq(paymentEstimateLines.estimateId, estimateId));
  await tx
    .update(paymentEstimates)
    .set({ ...totals, updatedAt: new Date() })
    .where(eq(paymentEstimates.id, estimateId));
}
