"use client";

import { chatModelDefinitions } from "next-vibe/agent/ai-stream/models";
import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { imageGenModelDefinitions } from "next-vibe/agent/image-generation/models";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import { ModelUtility } from "next-vibe/agent/models/enum";
import {
  getProviderPrice,
  isApiProviderAvailable,
  type ModelDefinition,
  modelProviders,
} from "next-vibe/agent/models/models";
import { ModelCreditDisplay } from "next-vibe/agent/models/widget/model-credit-display";
import { musicGenModelDefinitions } from "next-vibe/agent/music-generation/models";
import { sttModelDefinitions } from "next-vibe/agent/speech-to-text/models";
import { ttsModelDefinitions } from "next-vibe/agent/text-to-speech/models";
import { videoGenModelDefinitions } from "next-vibe/agent/video-generation/models";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
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
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation as subscriptionT } from "@/_pages/subscription/i18n";
import {
  FEATURE_COSTS,
  getPricingParams,
  ProductIds,
  productsRepository,
} from "@/products/repository-client";

import { CreditsTabHeader } from "./credits-tab-header";

const MODEL_TYPE_ORDER = [
  "text",
  "tts",
  "stt",
  "image",
  "audio",
  "video",
] as const;
type ModelTypeKey = (typeof MODEL_TYPE_ORDER)[number];

function getModelSortPrice(def: ModelDefinition): number {
  const p = def.providers[0];
  if (!p) {
    return 0;
  }
  return getProviderPrice(p);
}

export function CreditsBalanceContainer(): JSX.Element {
  const locale = useWidgetLocale();
  const widgetUser = useWidgetUser();
  const availability = useProviderAvailability();
  const { locale: currentLocale } = useTranslation();
  const { t: tSub } = subscriptionT.scopedT(currentLocale);

  const isAdmin =
    !widgetUser.isPublic && widgetUser.roles.includes(UserRole.ADMIN);
  const totalModelCount = getAvailableModelCount(isAdmin, availability);

  const products = productsRepository.getProducts(locale);
  const subscriptionProduct = products[ProductIds.SUBSCRIPTION];
  const freeProduct = productsRepository.getProduct(
    ProductIds.FREE_TIER,
    locale,
  );
  const packProduct = products[ProductIds.CREDIT_PACK];

  const [showLegacyModels, setShowLegacyModels] = useState(false);
  const [modelType, setModelType] = useState<ModelTypeKey>("text");
  const [featuresTab, setFeaturesTab] = useState(false);

  const modelsByType: Record<ModelTypeKey, ModelDefinition[]> = {
    text: Object.values(chatModelDefinitions),
    tts: Object.values(ttsModelDefinitions),
    stt: Object.values(sttModelDefinitions),
    image: Object.values(imageGenModelDefinitions),
    audio: Object.values(musicGenModelDefinitions),
    video: Object.values(videoGenModelDefinitions),
  };
  const visibleModels = (type: ModelTypeKey): ModelDefinition[] =>
    modelsByType[type].filter((def) => {
      if (!showLegacyModels && def.utilities.includes(ModelUtility.LEGACY)) {
        return false;
      }
      const visibleProviders = isAdmin
        ? def.providers
        : def.providers.filter((p) => !p.adminOnly);
      return visibleProviders.some((p) =>
        isApiProviderAvailable(p.apiProvider, availability),
      );
    });
  const availableTypes = MODEL_TYPE_ORDER.filter(
    (type) => visibleModels(type).length > 0,
  );
  const activeType = availableTypes.includes(modelType)
    ? modelType
    : (availableTypes[0] ?? "text");
  const activeByProvider = Object.entries(modelProviders)
    .map(([providerId, provider]) => ({
      providerId,
      provider,
      models: visibleModels(activeType)
        .filter((def) => def.by === providerId)
        .toSorted((a, b) => getModelSortPrice(a) - getModelSortPrice(b)),
    }))
    .filter(({ models }) => models.length > 0)
    .toSorted((a, b) => a.provider.name.localeCompare(b.provider.name));

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
        count: freeProduct.credits,
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
          {!featuresTab && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 self-start sm:self-auto"
              onClick={() => setShowLegacyModels(!showLegacyModels)}
            >
              {showLegacyModels
                ? tSub("subscription.overview.costs.models.hideLegacy")
                : tSub("subscription.overview.costs.models.showLegacy")}
            </Button>
          )}
        </Div>

        {/* Model type switcher — scrolls sideways on phones */}
        <Div className="flex gap-1 overflow-x-auto border-b px-3 py-2 [scrollbar-width:none]">
          {availableTypes.map((type) => (
            <Button
              key={type}
              type="button"
              variant="ghost"
              size="sm"
              role="tab"
              aria-selected={!featuresTab && type === activeType}
              onClick={() => {
                setModelType(type);
                setFeaturesTab(false);
              }}
              className={
                !featuresTab && type === activeType
                  ? "h-10 shrink-0 rounded-lg bg-primary/10 px-3 font-semibold text-primary hover:bg-primary/15 hover:text-primary"
                  : "h-10 shrink-0 rounded-lg px-3 text-muted-foreground"
              }
            >
              {tSub(`subscription.overview.costs.models.types.${type}`)}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            role="tab"
            aria-selected={featuresTab}
            onClick={() => setFeaturesTab(true)}
            className={
              featuresTab
                ? "h-10 shrink-0 rounded-lg bg-primary/10 px-3 font-semibold text-primary hover:bg-primary/15 hover:text-primary"
                : "h-10 shrink-0 rounded-lg px-3 text-muted-foreground"
            }
          >
            {tSub("subscription.overview.costs.features.title")}
          </Button>
        </Div>

        {!featuresTab && (
          <Div className="flex flex-col gap-5 p-5 sm:p-6">
            {activeByProvider.map(({ providerId, provider, models }) => (
              <Div key={providerId} className="flex flex-col gap-2">
                <Div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Icon icon={provider.icon} className="h-4 w-4" />
                  {provider.name}
                </Div>
                <Div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {models.map((def) => {
                    const isLegacy = def.utilities.includes(
                      ModelUtility.LEGACY,
                    );
                    const primaryId = def.providers[0].id;
                    return (
                      <Div
                        key={primaryId}
                        className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-b-0"
                      >
                        <Span className="flex min-w-0 items-center gap-1.5">
                          <Span className="truncate">{def.name}</Span>
                          {isLegacy && (
                            <Span className="shrink-0 rounded bg-muted px-1.5 text-[10px] font-medium uppercase text-muted-foreground">
                              {tSub(
                                "subscription.overview.costs.models.legacyBadge",
                              )}
                            </Span>
                          )}
                        </Span>
                        <ModelCreditDisplay
                          modelId={primaryId}
                          variant="text"
                          className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
                          locale={locale}
                        />
                      </Div>
                    );
                  })}
                </Div>
              </Div>
            ))}
          </Div>
        )}

        {/* Feature costs - own tab */}
        {featuresTab && (
          <Div className="flex flex-col gap-2 p-5 sm:p-6">
            <Div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {featureCosts.map((feature) => (
                <Div
                  key={feature.label}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-b-0"
                >
                  <Span className="min-w-0">{feature.label}</Span>
                  <Span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {tSub("subscription.overview.costs.features.costFormat", {
                      value: feature.value,
                      unit: creditsUnit,
                    })}
                  </Span>
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </Div>
    </WidgetShell>
  );
}
