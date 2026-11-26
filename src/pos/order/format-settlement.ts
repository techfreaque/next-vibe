import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";

import { isPosMinorUnitAmount } from "./settlement-amounts";

export function formatPosSettlement(
  amount: number,
  currency: string | null | undefined,
  locale: string,
): string {
  if (!Number.isFinite(amount) || isPosMinorUnitAmount(amount)) {
    return formatMoney(amount, currency, locale);
  }
  const code = currency?.trim().toUpperCase();
  return new Intl.NumberFormat(locale, {
    ...(code && /^[A-Z]{3}$/u.test(code)
      ? { style: "currency", currency: code }
      : {}),
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}
