import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { languageConfig } from "@/i18n";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import type { CreditTransactionOutput } from "@/app/api/[locale]/v1/core/credits/repository";
import type { CreditBalance } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/credits/handler";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";
import { type CreditTransaction } from "@/app/api/[locale]/v1/core/credits/db";
import { type TranslationKey } from "@/i18n/core/static-types";

export interface SubscriptionClientContentProps {
  locale: CountryLanguage;
  initialCredits: CreditBalance | null;
  initialHistory: {
    transactions: CreditTransactionOutput[];
    totalCount: number;
  } | null;
  initialSubscription: SubscriptionGetResponseOutput | null;
  isAuthenticated: boolean;
}

export const getTransactionTypeKey = (
  type: CreditTransaction["type"],
): TranslationKey => {
  switch (type) {
    case "purchase":
      return "app.subscription.subscription.history.types.purchase";
    case "subscription":
      return "app.subscription.subscription.history.types.subscription";
    case "usage":
      return "app.subscription.subscription.history.types.usage";
    case "expiry":
      return "app.subscription.subscription.history.types.expiry";
    case "free_tier":
      return "app.subscription.subscription.history.types.free_tier";
    default:
      return "app.subscription.subscription.history.types.usage"; // fallback
  }
};

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
