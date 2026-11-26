import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";

export function formatObservedProviderBalance(
  snapshot: {
    balanceNative: number | null;
    balanceUsd: number | null;
    unit: string | null;
  },
  locale: CountryLanguage,
): string | null {
  if (snapshot.balanceNative !== null && snapshot.unit) {
    const currency = CurrenciesArr.find(
      (code) => code === snapshot.unit?.trim().toUpperCase(),
    );
    return currency
      ? formatMoney(snapshot.balanceNative, currency, locale)
      : `${new Intl.NumberFormat(locale).format(snapshot.balanceNative)} ${snapshot.unit}`;
  }
  if (snapshot.balanceUsd !== null) {
    return formatMoney(snapshot.balanceUsd, "USD", locale);
  }
  return snapshot.balanceNative === null
    ? null
    : new Intl.NumberFormat(locale).format(snapshot.balanceNative);
}
