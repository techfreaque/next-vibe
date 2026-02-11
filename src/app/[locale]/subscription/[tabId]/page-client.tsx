/**
 * Subscription Page Client Component
 * Unified layout for all subscription tabs with consistent header and status cards
 */

"use client";

import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { BuyTab } from "@/app/[locale]/subscription/components/buy-tab";
import { OverviewTab } from "@/app/[locale]/subscription/components/overview-tab";
import { SubscriptionHeader } from "@/app/[locale]/subscription/components/subscription-header";
import { SubscriptionTabsNav } from "@/app/[locale]/subscription/components/subscription-tabs-nav";
import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import creditsDefinition from "@/app/api/[locale]/credits/definition";
import type { CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import historyDefinition from "@/app/api/[locale]/credits/history/definition";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import subscriptionDefinition from "@/app/api/[locale]/subscription/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface SubscriptionPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  isAuthenticated: boolean;
  activeTab: string;
  initialSubscription: SubscriptionGetResponseOutput | null;
  initialCredits: CreditsGetResponseOutput | null;
  initialHistory: CreditsHistoryGetResponseOutput | null;
}

export function SubscriptionPageClient({
  locale,
  user,
  isAuthenticated,
  activeTab,
  initialSubscription,
  initialCredits,
  initialHistory,
}: SubscriptionPageClientProps): JSX.Element {
  return (
    <Container className="py-8 flex flex-col gap-8">
      {/* Header - same for all tabs */}
      <SubscriptionHeader locale={locale} isAuthenticated={isAuthenticated} />

      {/* Credit Balance Card */}
      <EndpointsPage
        endpoint={creditsDefinition}
        user={user}
        locale={locale}
        endpointOptions={{
          read: {
            initialData: initialCredits || undefined,
          },
        }}
      />

      {/* Subscription Status Card - only show if subscription exists */}
      {initialSubscription && (
        <EndpointsPage
          endpoint={subscriptionDefinition}
          user={user}
          locale={locale}
          endpointOptions={{
            read: {
              initialData: initialSubscription,
            },
          }}
        />
      )}

      {/* Tabs Navigation - same for all tabs */}
      <SubscriptionTabsNav locale={locale} activeTab={activeTab} />

      {/* Tab Content - changes based on active tab */}
      {activeTab === "overview" && (
        <OverviewTab
          locale={locale}
          onSwitchTab={() => {
            // Navigation handled by SubscriptionTabsNav links
          }}
        />
      )}

      {activeTab === "buy" && <BuyTab locale={locale} user={user} />}

      {activeTab === "history" && (
        <Div className="w-full">
          <EndpointsPage
            endpoint={historyDefinition}
            user={user}
            locale={locale}
            endpointOptions={{
              read: {
                initialData: initialHistory || undefined,
              },
            }}
          />
        </Div>
      )}
    </Container>
  );
}
