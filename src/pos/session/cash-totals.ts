import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { posOrders, posPayments, posRefunds } from "../db";
import { PosOrderStatus, PosPaymentMethod } from "../enum";

type PosReader =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface PosSessionCash {
  /** Cash kept from completed sales in this session (tendered minus change). */
  cashSalesTotal: number;
  /** Cash paid out of this session's drawer for refunds. */
  cashRefundsTotal: number;
  /** Opening float + cash sales - cash refunds. */
  expectedCash: number;
}

/** Drawer math shared by session close, session get and cash refunds. */
export async function getPosSessionCash(
  reader: PosReader,
  sessionId: string,
  openingFloat: number,
): Promise<PosSessionCash> {
  const [sales] = await reader
    .select({
      total: sql<string>`coalesce(sum(${posPayments.amount} - ${posPayments.change}), 0)`,
    })
    .from(posPayments)
    .innerJoin(posOrders, eq(posOrders.id, posPayments.orderId))
    .where(
      and(
        eq(posOrders.sessionId, sessionId),
        eq(posOrders.status, PosOrderStatus.COMPLETED),
        eq(posPayments.method, PosPaymentMethod.CASH),
      ),
    );
  const [refunds] = await reader
    .select({
      total: sql<string>`coalesce(sum(${posRefunds.total}), 0)`,
    })
    .from(posRefunds)
    .where(
      and(
        eq(posRefunds.sessionId, sessionId),
        eq(posRefunds.method, PosPaymentMethod.CASH),
      ),
    );
  const salesUnits = Math.round(Number(sales?.total ?? 0) * 10_000);
  const refundUnits = Math.round(Number(refunds?.total ?? 0) * 10_000);
  return {
    cashSalesTotal: salesUnits / 10_000,
    cashRefundsTotal: refundUnits / 10_000,
    expectedCash:
      (Math.round(openingFloat * 10_000) + salesUnits - refundUnits) / 10_000,
  };
}
