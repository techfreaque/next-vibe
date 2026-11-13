/**
 * Shared <head> metadata for the /subscription tabs. Overview is the public
 * "Pricing" page (navbar + sitemap), so its title/description carry the real
 * numbers: free credits, plan price and credits, model count.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";

import { configScopedTranslation } from "@/env/i18n";
import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";
import { ProductIds, productsRepository } from "@/products/platform-products";

import { scopedTranslation } from "./i18n";

const SUBSCRIPTION_OG_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070";

export type SubscriptionMetaPage = "overview" | "buyCredits" | "history";

const PAGE_PATHS: Record<SubscriptionMetaPage, string> = {
  overview: "subscription/overview",
  buyCredits: "subscription/buy",
  history: "subscription/history",
};

export async function generateSubscriptionMetadata(
  locale: CountryLanguage,
  page: SubscriptionMetaPage,
): Promise<Metadata> {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const subscription =
    productsRepository.getProducts(locale)[ProductIds.SUBSCRIPTION];
  const values = {
    appName,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    subCredits: subscription.credits,
    subPrice: formatCurrency(subscription.price, subscription.currency, locale),
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
  };

  return metadataGenerator(locale, {
    path: PAGE_PATHS[page],
    title: t(`meta.${page}.title`, values),
    description: t(`meta.${page}.description`, values),
    category: t("meta.category"),
    image: SUBSCRIPTION_OG_IMAGE,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
    // Balances and history are per-user; only the pricing overview is indexable.
    additionalMetadata:
      page === "overview" ? {} : { robots: { index: false, follow: true } },
  });
}
