"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Div } from "next-vibe/ui/components/div";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Span } from "next-vibe/ui/components/span";
import { H4, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { ModelCatalog } from "@/_pages/models/_shared/model-catalog";
import {
  CATALOG_TYPE_ORDER,
  type CatalogEntry,
  type CatalogType,
  listAllCatalogEntries,
} from "@/_pages/models/_shared/model-catalog-entries";
import { scopedTranslation as subscriptionT } from "@/_pages/subscription/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import {
  FEATURE_COSTS,
  getPricingParams,
  ProductIds,
  productsRepository,
} from "@/products/repository-client";

import { CreditsTabHeader } from "./credits-tab-header";

export function CreditsBalanceContainer(): JSX.Element {
  const locale = useWidgetLocale();
  const widgetUser = useWidgetUser();
  const availability = useProviderAvailability();
  const { locale: currentLocale } = useTranslation();
  const { t: tSub } = subscriptionT.scopedT(currentLocale);

  const isAdmin =
    !widgetUser.isPublic && widgetUser.roles.includes(UserRole.ADMIN);
  const totalModelCount = getAvailableChatModelCount(isAdmin, availability);

  const products = productsRepository.getProducts(locale);
  const subscriptionProduct = products[ProductIds.SUBSCRIPTION];
  const packProduct = products[ProductIds.CREDIT_PACK];

  const allEntries = listAllCatalogEntries({ isAdmin, availability });
  const entriesByType: Partial<Record<CatalogType, CatalogEntry[]>> = {};
  for (const type of CATALOG_TYPE_ORDER) {
    const entries = allEntries[type] ?? [];
    if (entries.length > 0) {
      entriesByType[type] = entries;
    }
  }

  const pricing = getPricingParams(locale);
  const creditsUnit = tSub("subscription.overview.costs.features.creditsUnit");
  const featureCosts = [
    {
      label: tSub("subscription.overview.costs.features.braveSearchLabel"),
      value: FEATURE_COSTS.BRAVE_SEARCH,
    },
    {
      label: tSub("subscription.overview.costs.features.kagiSearchLabel"),
      value: FEATURE_COSTS.KAGI_SEARCH,
    },
    {
      label: tSub("subscription.overview.costs.features.fetchUrlLabel"),
      value: FEATURE_COSTS.FETCH_URL_CONTENT,
    },
  ];

  const howItWorks = [
    {
      key: "expiring",
      icon: <Calendar className="h-4 w-4" />,
      tone: "bg-warning/10 text-warning",
      title: tSub("subscription.overview.howItWorks.expiring.title"),
      description: tSub(
        "subscription.overview.howItWorks.expiring.description",
        {
          subPrice: pricing.subscriptionPrice,
          subCredits: subscriptionProduct.credits,
          modelCount: totalModelCount,
        },
      ),
    },
    {
      key: "permanent",
      icon: <Sparkles className="h-4 w-4" />,
      tone: "bg-success/10 text-success",
      title: tSub("subscription.overview.howItWorks.permanent.title"),
      description: tSub(
        "subscription.overview.howItWorks.permanent.description",
        {
          packPrice: pricing.packPrice,
          packCredits: packProduct.credits,
          subCredits: subscriptionProduct.credits,
        },
      ),
    },
    {
      key: "free",
      icon: <Zap className="h-4 w-4" />,
      tone: "bg-info/10 text-info",
      title: tSub("subscription.overview.howItWorks.free.title"),
      description: tSub("subscription.overview.howItWorks.free.description", {
        guest: FREE_CREDIT_ALLOWANCE.guest,
        signedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
        max: FREE_CREDIT_MAX_TOTAL,
      }),
    },
  ];

  return (
    <WidgetShell className="gap-6">
      <CreditsTabHeader activeTab="overview" />

      {/* How credits work */}
      <Div className="flex flex-col gap-3">
        <Div className="flex flex-col gap-0.5 px-1">
          <H4 className="m-0 text-lg font-semibold tracking-tight">
            {tSub("subscription.overview.howItWorks.title")}
          </H4>
          <P className="m-0 text-sm text-muted-foreground">
            {tSub("subscription.overview.howItWorks.description", {
              subCredits: subscriptionProduct.credits,
            })}
          </P>
        </Div>
        <Div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {howItWorks.map((item) => (
            <Div
              key={item.key}
              className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
            >
              <Span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.tone}`}
              >
                {item.icon}
              </Span>
              <Div className="flex flex-col gap-1">
                <Span className="text-sm font-semibold">{item.title}</Span>
                <Span className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </Span>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Model pricing */}
      <Div
        id="model-costs"
        className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
      >
        <Div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Div className="flex items-center gap-3">
            <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Coins className="h-4 w-4" />
            </Span>
            <Div className="flex flex-col gap-0.5">
              <H4 className="m-0 text-lg font-semibold tracking-tight">
                {tSub("subscription.overview.costs.title")}
              </H4>
              <P className="m-0 text-sm text-muted-foreground">
                {tSub("subscription.overview.costs.description")}
              </P>
            </Div>
          </Div>
        </Div>

        <ModelCatalog
          locale={locale}
          entriesByType={entriesByType}
          linkModels
          extraTab={{
            label: tSub("subscription.overview.costs.features.title"),
            content: (
              <Div className="flex flex-col gap-2 p-5 sm:p-6">
                <Div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {featureCosts.map((feature) => (
                    <Div
                      key={feature.label}
                      className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-b-0"
                    >
                      <Span className="min-w-0">{feature.label}</Span>
                      <Span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {tSub(
                          "subscription.overview.costs.features.costFormat",
                          { value: feature.value, unit: creditsUnit },
                        )}
                      </Span>
                    </Div>
                  ))}
                </Div>
              </Div>
            ),
          }}
        />
      </Div>
    </WidgetShell>
  );
}
