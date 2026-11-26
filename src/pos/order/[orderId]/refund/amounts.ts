/**
 * POS refund amounts.
 *
 * Refunds are planned cumulatively: the money refunded after this refund is the
 * settlement of everything refunded so far, and this refund is the difference
 * to what earlier refunds already paid. Refunding every remaining unit lands
 * exactly on the order's settled totals, so the refunds of one order can never
 * add up to more (or less) than the sale.
 */

import {
  isPosMinorUnitAmount,
  posSettlementAmounts,
} from "../../settlement-amounts";

export interface PosRefundSourceLine {
  orderItemId: string;
  quantity: number;
  lineTotal: number;
  taxAmount: number;
  refundedQuantity: number;
  refundedLineTotal: number;
  refundedTaxAmount: number;
}

export interface PosRefundRequestLine {
  orderItemId: string;
  quantity: number;
}

export interface PosRefundTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface PosRefundPlanLine {
  orderItemId: string;
  quantity: number;
  lineTotal: number;
  taxAmount: number;
}

export type PosRefundPlan =
  | {
      ok: true;
      lines: PosRefundPlanLine[];
      subtotal: number;
      taxAmount: number;
      total: number;
      /** Cumulative refunded total of the order after this refund. */
      refundedTotal: number;
      fullyRefunded: boolean;
    }
  | {
      ok: false;
      reason: "invalidLine" | "nothingLeft" | "overRefund" | "rounding";
    };

const UNITS = 10_000;

function units(value: number): number {
  return Math.round(value * UNITS);
}

function exactUnits(value: number): number | undefined {
  const result = units(value);
  return Number.isSafeInteger(result) && result / UNITS === value
    ? result
    : undefined;
}

/** Share of a line amount for a cumulative quantity, rounded half away from zero. */
function lineShare(
  amountUnits: number,
  quantityUnits: number,
  cumulativeUnits: number,
): number {
  if (cumulativeUnits === quantityUnits) {
    return amountUnits;
  }
  const numerator = BigInt(amountUnits) * BigInt(cumulativeUnits);
  const divisor = BigInt(quantityUnits);
  const half = divisor / BigInt(2);
  return Number((numerator + (numerator < BigInt(0) ? -half : half)) / divisor);
}

function centUnits(value: number): number {
  return Math.round(value * 100);
}

/**
 * Plan a refund. `request` undefined refunds every remaining unit.
 */
export function planPosRefund(
  source: readonly PosRefundSourceLine[],
  request: readonly PosRefundRequestLine[] | undefined,
  order: PosRefundTotals,
  prior: PosRefundTotals,
): PosRefundPlan {
  const wanted = new Map<string, number>();
  if (request) {
    for (const line of request) {
      const quantity = exactUnits(line.quantity);
      if (
        quantity === undefined ||
        quantity <= 0 ||
        wanted.has(line.orderItemId) ||
        !source.some((item) => item.orderItemId === line.orderItemId)
      ) {
        return { ok: false, reason: "invalidLine" };
      }
      wanted.set(line.orderItemId, quantity);
    }
  } else {
    for (const item of source) {
      const remaining = units(item.quantity) - units(item.refundedQuantity);
      if (remaining > 0) {
        wanted.set(item.orderItemId, remaining);
      }
    }
  }
  if (wanted.size === 0) {
    return { ok: false, reason: "nothingLeft" };
  }

  const lines: PosRefundPlanLine[] = [];
  let grossAfter = 0;
  let taxAfter = 0;
  let fullyRefunded = true;
  for (const item of source) {
    const quantityUnits = units(item.quantity);
    const refundedUnits = units(item.refundedQuantity);
    const add = wanted.get(item.orderItemId) ?? 0;
    const cumulative = refundedUnits + add;
    if (cumulative > quantityUnits) {
      return { ok: false, reason: "overRefund" };
    }
    if (cumulative < quantityUnits) {
      fullyRefunded = false;
    }
    if (add === 0) {
      grossAfter += units(item.refundedLineTotal);
      taxAfter += units(item.refundedTaxAmount);
      continue;
    }
    const gross = lineShare(units(item.lineTotal), quantityUnits, cumulative);
    const tax = lineShare(units(item.taxAmount), quantityUnits, cumulative);
    const lineTotal = gross - units(item.refundedLineTotal);
    const taxAmount = tax - units(item.refundedTaxAmount);
    if (lineTotal < 0 || taxAmount < 0) {
      return { ok: false, reason: "rounding" };
    }
    grossAfter += gross;
    taxAfter += tax;
    lines.push({
      orderItemId: item.orderItemId,
      quantity: add / UNITS,
      lineTotal: lineTotal / UNITS,
      taxAmount: taxAmount / UNITS,
    });
  }

  const after = fullyRefunded
    ? order
    : posSettlementAmounts(grossAfter / UNITS, taxAfter / UNITS);
  const total = centUnits(after.total) - centUnits(prior.total);
  const taxAmount = centUnits(after.taxAmount) - centUnits(prior.taxAmount);
  const subtotal = centUnits(after.subtotal) - centUnits(prior.subtotal);
  if (centUnits(after.total) > centUnits(order.total)) {
    return { ok: false, reason: "overRefund" };
  }
  if (
    total <= 0 ||
    taxAmount < 0 ||
    subtotal < 0 ||
    subtotal + taxAmount !== total ||
    ![after.total, after.taxAmount, after.subtotal].every(isPosMinorUnitAmount)
  ) {
    return { ok: false, reason: "rounding" };
  }
  return {
    ok: true,
    lines,
    subtotal: subtotal / 100,
    taxAmount: taxAmount / 100,
    total: total / 100,
    refundedTotal: centUnits(after.total) / 100,
    fullyRefunded,
  };
}
