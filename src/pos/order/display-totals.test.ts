import { expect, test } from "bun:test";
import { PosOrderStatus } from "../enum";
import { cashChangeDue, orderTotalsByCurrency } from "./display-totals";

test("cash change uses the remaining balance, including retained cash from prior tenders", () => {
  expect(cashChangeDue(20, 12.5, [])).toBe(7.5);
  expect(cashChangeDue(5, 12.5, [])).toBe(0);
  expect(cashChangeDue(20, 27.125, [{ amount: 14, change: 2.125 }])).toBe(4.75);
});
test("order totals group currency and exclude voided orders", () => {
  const orders = [
    { currency: "USD", status: PosOrderStatus.OPEN, total: 15.001 },
    { currency: "EUR", status: PosOrderStatus.COMPLETED, total: 10 },
    { currency: "USD", status: PosOrderStatus.COMPLETED, total: 4.0001 },
    { currency: "EUR", status: PosOrderStatus.VOIDED, total: 99 },
  ];
  expect(orderTotalsByCurrency(orders)).toEqual([
    { currency: "EUR", amount: 10 },
    { currency: "USD", amount: 19.0011 },
  ]);
});
