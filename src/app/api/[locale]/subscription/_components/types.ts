import { CreditTransactionType } from "@/app/api/[locale]/credits/enum";
import type {
  CreditBalance,
  CreditTransactionOutput,
} from "@/app/api/[locale]/credits/repository";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { formatSimpleDate } from "@/i18n/core/localization-utils";
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
  type: CreditTransactionOutput["type"],
): TranslationKey => {
  switch (type) {
    case CreditTransactionType.PURCHASE:
      return "app.subscription.subscription.history.types.purchase";
    case CreditTransactionType.SUBSCRIPTION:
      return "app.subscription.subscription.history.types.subscription";
    case CreditTransactionType.USAGE:
      return "app.subscription.subscription.history.types.usage";
    case CreditTransactionType.EXPIRY:
      return "app.subscription.subscription.history.types.expiry";
    case CreditTransactionType.FREE_GRANT:
      return "app.subscription.subscription.history.types.free_grant";
    case CreditTransactionType.REFUND:
      return "app.subscription.subscription.history.types.refund";
    case CreditTransactionType.TRANSFER:
      return "app.subscription.subscription.history.types.transfer";
    case CreditTransactionType.OTHER_DEVICES:
      return "app.subscription.subscription.history.types.other_devices";
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
