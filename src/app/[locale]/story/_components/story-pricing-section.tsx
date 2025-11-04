"use client";

import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/v1/core/products/repository-client";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { BuyCreditsTab } from "@/app/[locale]/subscription/_components/buy-credits-tab";
import { OverviewTab } from "@/app/[locale]/subscription/_components/overview-tab";

interface SubscriptionData {
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

interface StoryPricingSectionProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  initialSubscription: SubscriptionData | null;
}

export function StoryPricingSection({
  locale,
  isAuthenticated,
  initialSubscription,
}: StoryPricingSectionProps): JSX.Element {
  const { t } = useTranslation();

  // Get pricing from centralized products repository with proper locale
  const products = productsRepository.getProducts(locale);
  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;

  return (
    <Container className="py-16 space-y-12">
      {/* Section Header */}
      <Div className="text-center space-y-4">
        <H2 className="text-3xl font-bold tracking-tight">
          {t("app.story._components.home.pricingSection.title")}
        </H2>
        <P className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("app.story._components.home.pricingSection.description")}
        </P>
      </Div>

      {/* Overview Section */}
      <Div className="space-y-6">
        <OverviewTab locale={locale} />
      </Div>

      {/* Buy Credits Section */}
      <Div className="space-y-6">
        <BuyCreditsTab
          locale={locale}
          isAuthenticated={isAuthenticated}
          initialSubscription={initialSubscription}
          subscriptionPrice={SUBSCRIPTION_PRICE}
          subscriptionCredits={SUBSCRIPTION_CREDITS}
          packPrice={PACK_PRICE}
          packCredits={PACK_CREDITS}
        />
      </Div>
    </Container>
  );
}
