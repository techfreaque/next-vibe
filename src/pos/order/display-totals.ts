import { PosOrderStatus } from "../enum";

export function outstandingSaleAmount(
  total: number,
  payments: readonly { amount: number; change: number | null }[],
): number {
  const received = payments.reduce(
    (sum, payment) =>
      sum +
      Math.round(payment.amount * 10_000) -
      Math.round((payment.change ?? 0) * 10_000),
    0,
  );
  return Math.max(0, Math.round(total * 10_000) - received) / 10_000;
}

export function cashChangeDue(
  tendered: number,
  total: number,
  payments: readonly { amount: number; change: number | null }[],
): number {
  const outstanding = Math.round(
    outstandingSaleAmount(total, payments) * 10_000,
  );
  return Math.max(0, Math.round(tendered * 10_000) - outstanding) / 10_000;
}

export function orderTotalsByCurrency(
  orders: readonly {
    currency: string;
    status: string;
    total: number | string;
  }[],
): { currency: string; amount: number }[] {
  const units = new Map<string, number>();
  for (const order of orders) {
    if (order.status !== PosOrderStatus.VOIDED) {
      units.set(
        order.currency,
        (units.get(order.currency) ?? 0) +
          Math.round(Number(order.total) * 10_000),
      );
    }
  }
  return [...units]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([currency, value]) => ({ currency, amount: value / 10_000 }));
}
