/** POS stores four-place line values. Settle totals by the same policy as invoices. */
export function posSettlementAmounts(
  grossAmount: number,
  taxAmount: number,
): { subtotal: number; taxAmount: number; total: number } {
  const grossCents = Math.round(Math.round(grossAmount * 10_000) / 100);
  const taxCents = Math.round(Math.round(taxAmount * 10_000) / 100);
  return {
    subtotal: (grossCents - taxCents) / 100,
    taxAmount: taxCents / 100,
    total: grossCents / 100,
  };
}

export function isPosMinorUnitAmount(amount: number): boolean {
  const cents = Math.round(amount * 100);
  return Number.isSafeInteger(cents) && cents / 100 === amount;
}
