import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

export const formatDate = (
  date: string | Date,
  locale: CountryLanguage,
): string => {
  try {
    const dateObject = new Date(date);
    return formatSimpleDate(dateObject, locale);
  } catch {
    return new Date(date).toLocaleDateString();
  }
};

export const formatPrice = (
  amount: number,
  locale: CountryLanguage,
): string => {
  const country = getCountryFromLocale(locale);
  const currency = languageConfig.mappings.currencyByCountry[country];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
