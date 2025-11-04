import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { languageConfig } from "@/i18n";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

/**
 * Credit Balance Interface
 */
export interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

/**
 * Credit Transaction Interface
 */
export interface CreditTransaction {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  modelId: string | null;
  messageId: string | null;
  createdAt: string;
}

/**
 * Subscription Data Interface
 */
export interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  billingInterval: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionClientContentProps {
  locale: CountryLanguage;
  initialCredits: CreditBalance | null;
  initialHistory: {
    transactions: CreditTransaction[];
    totalCount: number;
  } | null;
  initialSubscription: SubscriptionData | null;
  isAuthenticated: boolean;
}

export const getTransactionTypeKey = (
  type: string,
):
  | "app.subscription.subscription.history.types.purchase"
  | "app.subscription.subscription.history.types.subscription"
  | "app.subscription.subscription.history.types.usage"
  | "app.subscription.subscription.history.types.expiry"
  | "app.subscription.subscription.history.types.free_tier" => {
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
