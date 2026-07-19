"use client";

import { chatModelDefinitions } from "next-vibe/agent/ai-stream/models";
import { useProviderAvailability } from "next-vibe/agent/env-availability-context";
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
import { Button } from "next-vibe/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { ArrowRight } from "next-vibe/ui/ui/icons/ArrowRight";
import { Calendar } from "next-vibe/ui/ui/icons/Calendar";
import { Coins } from "next-vibe/ui/ui/icons/Coins";
import { Info } from "next-vibe/ui/ui/icons/Info";
import { Sparkles } from "next-vibe/ui/ui/icons/Sparkles";
import { Zap } from "next-vibe/ui/ui/icons/Zap";
import { Span } from "next-vibe/ui/ui/span";
import { H4, P } from "next-vibe/ui/ui/typography";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation as subscriptionT } from "@/_pages/subscription/i18n";
import {
  FEATURE_COSTS,
  ProductIds,
  productsRepository,
} from "@/products/repository-client";

import { CreditsTabHeader } from "./credits-tab-header";

function formatPrice(amount: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `€${amount}`;
  }
}

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
  const navigation = useWidgetNavigation();
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

  const handleBuyClick = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/subscription/create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  return (
    <WidgetShell>
      <CreditsTabHeader activeTab="overview" />

      {/* Overview content */}
      <Div className="flex flex-col gap-6">
        {/* How credits work */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {tSub("subscription.overview.howItWorks.title")}
            </CardTitle>
            <CardDescription>
              {tSub("subscription.overview.howItWorks.description", {
                subCredits: subscriptionProduct.credits,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10">
              <Calendar className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <Div>
                <P className="font-medium text-warning">
                  {tSub("subscription.overview.howItWorks.expiring.title")}
                </P>
                <P className="text-sm text-warning/80">
                  {tSub(
                    "subscription.overview.howItWorks.expiring.description",
                    {
                      subPrice: formatPrice(subscriptionProduct.price, locale),
                      subCredits: subscriptionProduct.credits,
                      modelCount: totalModelCount,
                    },
                  )}
                </P>
              </Div>
            </Div>
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
              <Sparkles className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <Div>
                <P className="font-medium text-success">
                  {tSub("subscription.overview.howItWorks.permanent.title")}
                </P>
                <P className="text-sm text-success/80">
                  {tSub(
                    "subscription.overview.howItWorks.permanent.description",
                    {
                      packPrice: formatPrice(packProduct.price, locale),
                      packCredits: packProduct.credits,
                      subCredits: subscriptionProduct.credits,
                    },
                  )}
                </P>
              </Div>
            </Div>
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-info/10">
              <Zap className="h-5 w-5 text-info mt-0.5 shrink-0" />
              <Div>
                <P className="font-medium text-info">
                  {tSub("subscription.overview.howItWorks.free.title")}
                </P>
                <P className="text-sm text-info/80">
                  {tSub("subscription.overview.howItWorks.free.description", {
                    count: freeProduct.credits,
                  })}
                </P>
              </Div>
            </Div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="overflow-hidden border-0 bg-linear-to-br from-primary/10 via-primary/5 to-background">
          <CardContent className="p-8">
            <Div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Div className="flex-1 text-center md:text-left">
                <H4 className="text-2xl font-bold mb-2">
                  {tSub("subscription.overview.cta.title")}
                </H4>
                <P className="text-muted-foreground">
                  {tSub("subscription.overview.cta.description", {
                    modelCount: totalModelCount,
                  })}
                </P>
              </Div>
              <Button
                size="lg"
                onClick={handleBuyClick}
                className="group flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {tSub("subscription.overview.cta.button")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Div>
          </CardContent>
        </Card>

        {/* Model pricing */}
        <Card id="model-costs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              {tSub("subscription.overview.costs.title")}
            </CardTitle>
            <CardDescription>
              {tSub("subscription.overview.costs.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Div className="flex flex-col gap-6">
              <Div>
                <Div className="flex items-center justify-between mb-3">
                  <H4 className="font-semibold">
                    {tSub("subscription.overview.costs.models.title")}
                  </H4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLegacyModels(!showLegacyModels)}
                  >
                    {showLegacyModels
                      ? tSub("subscription.overview.costs.models.hideLegacy")
                      : tSub("subscription.overview.costs.models.showLegacy")}
                  </Button>
                </Div>
                <Div className="flex flex-col gap-6">
                  {MODEL_TYPE_ORDER.map((modelType: ModelTypeKey) => {
                    const modelsByType: Record<
                      ModelTypeKey,
                      ModelDefinition[]
                    > = {
                      text: Object.values(chatModelDefinitions),
                      tts: Object.values(ttsModelDefinitions),
                      stt: Object.values(sttModelDefinitions),
                      image: Object.values(imageGenModelDefinitions),
                      audio: Object.values(musicGenModelDefinitions),
                      video: Object.values(videoGenModelDefinitions),
                    };
                    const typeModels = modelsByType[modelType].filter((def) => {
                      if (
                        !showLegacyModels &&
                        def.utilities.includes(ModelUtility.LEGACY)
                      ) {
                        return false;
                      }
                      const visibleProviders = isAdmin
                        ? def.providers
                        : def.providers.filter((p) => !p.adminOnly);
                      return visibleProviders.some((p) =>
                        isApiProviderAvailable(p.apiProvider, availability),
                      );
                    });
                    if (typeModels.length === 0) {
                      return null;
                    }

                    const byProvider = Object.entries(modelProviders)
                      .map(([providerId, provider]) => ({
                        providerId,
                        provider,
                        models: typeModels
                          .filter((def) => def.by === providerId)
                          .toSorted(
                            (a, b) =>
                              getModelSortPrice(a) - getModelSortPrice(b),
                          ),
                      }))
                      .filter(({ models }) => models.length > 0)
                      .toSorted((a, b) =>
                        a.provider.name.localeCompare(b.provider.name),
                      );

                    return (
                      <Div key={modelType}>
                        <H4 className="font-semibold mb-3 text-base">
                          {tSub(
                            `subscription.overview.costs.models.types.${modelType}`,
                          )}
                        </H4>
                        <Div className="flex flex-col gap-4">
                          {byProvider.map(
                            ({ providerId, provider, models }) => (
                              <Div key={providerId}>
                                <Div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground font-medium">
                                  <Icon
                                    icon={provider.icon}
                                    className="h-4 w-4"
                                  />
                                  {provider.name}
                                </Div>
                                <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  {models.map((def) => {
                                    const isLegacy = def.utilities.includes(
                                      ModelUtility.LEGACY,
                                    );
                                    const primaryId = def.providers[0].id;
                                    return (
                                      <Div
                                        key={primaryId}
                                        className="flex items-center gap-3 p-2 rounded bg-accent"
                                      >
                                        <Span className="flex items-center gap-1 flex-1 min-w-0">
                                          {def.name}
                                          {isLegacy && (
                                            <Span className="text-xs text-muted-foreground">
                                              (
                                              {tSub(
                                                "subscription.overview.costs.models.legacyBadge",
                                              )}
                                              )
                                            </Span>
                                          )}
                                        </Span>
                                        <ModelCreditDisplay
                                          modelId={primaryId}
                                          variant="text"
                                          className="font-mono text-xs shrink-0"
                                          locale={locale}
                                        />
                                      </Div>
                                    );
                                  })}
                                </Div>
                              </Div>
                            ),
                          )}
                        </Div>
                      </Div>
                    );
                  })}
                </Div>
              </Div>

              {/* Feature costs */}
              <Div>
                <H4 className="font-semibold mb-2">
                  {tSub("subscription.overview.costs.features.title")}
                </H4>
                <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                    <Span>
                      {tSub(
                        "subscription.overview.costs.features.braveSearchLabel",
                      )}
                    </Span>
                    <Span className="font-mono">
                      {tSub("subscription.overview.costs.features.costFormat", {
                        value: FEATURE_COSTS.BRAVE_SEARCH,
                        unit: tSub(
                          "subscription.overview.costs.features.creditsUnit",
                        ),
                      })}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                    <Span>
                      {tSub(
                        "subscription.overview.costs.features.kagiSearchLabel",
                      )}
                    </Span>
                    <Span className="font-mono">
                      {tSub("subscription.overview.costs.features.costFormat", {
                        value: FEATURE_COSTS.KAGI_SEARCH,
                        unit: tSub(
                          "subscription.overview.costs.features.creditsUnit",
                        ),
                      })}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                    <Span>
                      {tSub(
                        "subscription.overview.costs.features.fetchUrlLabel",
                      )}
                    </Span>
                    <Span className="font-mono">
                      {tSub("subscription.overview.costs.features.costFormat", {
                        value: FEATURE_COSTS.FETCH_URL_CONTENT,
                        unit: tSub(
                          "subscription.overview.costs.features.creditsUnit",
                        ),
                      })}
                    </Span>
                  </Div>
                </Div>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </WidgetShell>
  );
}
