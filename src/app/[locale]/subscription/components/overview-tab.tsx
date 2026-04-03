import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation } from "@/app/[locale]/subscription/i18n";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { ModelUtility } from "@/app/api/[locale]/agent/models/enum";
import {
  ApiProvider,
  type ModelDefinition,
  getProviderPrice,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import {
  FEATURE_COSTS,
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatModelDefinitions } from "@/app/api/[locale]/agent/ai-stream/models";
import { imageGenModelDefinitions } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelDefinitions } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelDefinitions } from "@/app/api/[locale]/agent/speech-to-text/models";
import { ttsModelDefinitions } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelDefinitions } from "@/app/api/[locale]/agent/video-generation/models";
import { formatPrice } from "./types";

function checkProviderAvailable(
  apiProvider: ApiProvider,
  envAvailability: AgentEnvAvailability | undefined,
): boolean {
  if (!envAvailability) {
    return true;
  }
  switch (apiProvider) {
    case ApiProvider.OPENROUTER:
      return envAvailability.openRouter;
    case ApiProvider.CLAUDE_CODE:
      return envAvailability.claudeCode;
    case ApiProvider.UNCENSORED_AI:
      return envAvailability.uncensoredAI;
    case ApiProvider.FREEDOMGPT:
      return envAvailability.freedomGPT;
    case ApiProvider.GAB_AI:
      return envAvailability.gabAI;
    case ApiProvider.VENICE_AI:
      return envAvailability.veniceAI;
    case ApiProvider.OPENAI_IMAGES:
      return envAvailability.openAiImages;
    case ApiProvider.REPLICATE:
      return envAvailability.replicate;
    case ApiProvider.FAL_AI:
      return envAvailability.falAi;
    case ApiProvider.MODELSLAB:
      return envAvailability.modelsLab;
    default:
      return true;
  }
}

interface OverviewTabProps {
  locale: CountryLanguage;
  onSwitchTab: () => void;
  envAvailability: AgentEnvAvailability;
  totalModelCount: number;
}

const MODEL_TYPE_ORDER = ["text", "image", "audio", "video"] as const;
type ModelTypeKey = (typeof MODEL_TYPE_ORDER)[number];

/** Returns a representative price for sorting (ascending = cheapest first). */
function getModelSortPrice(def: ModelDefinition): number {
  const p = def.providers[0];
  if (!p) {
    return 0;
  }
  return getProviderPrice(p);
}

export function OverviewTab({
  locale,
  onSwitchTab,
  envAvailability,
  totalModelCount,
}: OverviewTabProps): JSX.Element {
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(currentLocale);
  const [showLegacyModels, setShowLegacyModels] = useState(false);

  const products = productsRepository.getProducts(locale);
  const subscriptionProduct = products[ProductIds.SUBSCRIPTION];
  const subscriptionPrice = subscriptionProduct.price;
  const subscriptionCredits = subscriptionProduct.credits;
  const packProduct = products[ProductIds.CREDIT_PACK];
  const packPrice = packProduct.price;
  const packCredits = packProduct.credits;
  const freeProduct = products[ProductIds.FREE_TIER];
  const freeCredits = freeProduct.credits;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("subscription.overview.howItWorks.title")}
          </CardTitle>
          <CardDescription>
            {t("subscription.overview.howItWorks.description", {
              subCredits: subscriptionCredits,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Div className="flex flex-col gap-3">
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <Div>
                <P className="font-medium text-amber-900 dark:text-amber-100">
                  {t("subscription.overview.howItWorks.expiring.title")}
                </P>
                <P className="text-sm text-amber-700 dark:text-amber-300">
                  {t("subscription.overview.howItWorks.expiring.description", {
                    subPrice: formatPrice(subscriptionPrice, locale),
                    subCredits: subscriptionCredits,
                    modelCount: totalModelCount,
                  })}
                </P>
              </Div>
            </Div>

            <Div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <Div>
                <P className="font-medium text-green-900 dark:text-green-100">
                  {t("subscription.overview.howItWorks.permanent.title")}
                </P>
                <P className="text-sm text-green-700 dark:text-green-300">
                  {t("subscription.overview.howItWorks.permanent.description", {
                    packPrice: formatPrice(packPrice, locale),
                    packCredits,
                    subCredits: subscriptionCredits,
                  })}
                </P>
              </Div>
            </Div>

            <Div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <Div>
                <P className="font-medium text-blue-900 dark:text-blue-100">
                  {t("subscription.overview.howItWorks.free.title")}
                </P>
                <P className="text-sm text-blue-700 dark:text-blue-300">
                  {t("subscription.overview.howItWorks.free.description", {
                    count: freeCredits,
                  })}
                </P>
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="mt-6 overflow-hidden border-0 bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="p-8">
          <Div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Div className="flex-1 text-center md:text-left">
              <H4 className="text-2xl font-bold mb-2">
                {t("subscription.overview.cta.title")}
              </H4>
              <P className="text-muted-foreground">
                {t("subscription.overview.cta.description", {
                  modelCount: totalModelCount,
                })}
              </P>
            </Div>
            <Button
              size="lg"
              onClick={onSwitchTab}
              className="group flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {t("subscription.overview.cta.button")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Div>
        </CardContent>
      </Card>

      {/* Cost Reference */}
      <Card className="mt-6" id="model-costs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {t("subscription.overview.costs.title")}
          </CardTitle>
          <CardDescription>
            {t("subscription.overview.costs.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-col gap-4">
            <Div>
              <Div className="flex items-center justify-between mb-2">
                <H4 className="font-semibold">
                  {t("subscription.overview.costs.models.title")}
                </H4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLegacyModels(!showLegacyModels)}
                >
                  {showLegacyModels
                    ? t("subscription.overview.costs.models.hideLegacy")
                    : t("subscription.overview.costs.models.showLegacy")}
                </Button>
              </Div>
              <Div className="flex flex-col gap-6">
                {MODEL_TYPE_ORDER.map((modelType: ModelTypeKey) => {
                  const modelsByType: Record<ModelTypeKey, ModelDefinition[]> =
                    {
                      text: [
                        ...Object.values(chatModelDefinitions),
                        ...Object.values(ttsModelDefinitions),
                        ...Object.values(sttModelDefinitions),
                      ],
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
                    return def.providers.some((p) =>
                      checkProviderAvailable(p.apiProvider, envAvailability),
                    );
                  });
                  if (typeModels.length === 0) {
                    return null;
                  }

                  // Sub-group by provider company, sorted A-Z
                  const byProvider = Object.entries(modelProviders)
                    .map(([providerId, provider]) => ({
                      providerId,
                      provider,
                      models: typeModels
                        .filter((def) => def.by === providerId)
                        .toSorted(
                          (a, b) => getModelSortPrice(a) - getModelSortPrice(b),
                        ),
                    }))
                    .filter(({ models }) => models.length > 0)
                    .toSorted((a, b) =>
                      a.provider.name.localeCompare(b.provider.name),
                    );

                  return (
                    <Div key={modelType}>
                      <H4 className="font-semibold mb-3 text-base">
                        {t(
                          `subscription.overview.costs.models.types.${modelType}`,
                        )}
                      </H4>
                      <Div className="flex flex-col gap-4">
                        {byProvider.map(({ providerId, provider, models }) => (
                          <Div key={providerId}>
                            <Div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground font-medium">
                              <Icon icon={provider.icon} className="h-4 w-4" />
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
                                    <Span className="flex items-center gap-1">
                                      {def.name}
                                      {isLegacy && (
                                        <Span className="text-xs text-muted-foreground">
                                          (
                                          {t(
                                            "subscription.overview.costs.models.legacyBadge",
                                          )}
                                          )
                                        </Span>
                                      )}
                                    </Span>
                                    <ModelCreditDisplay
                                      modelId={primaryId}
                                      variant="text"
                                      className="font-mono"
                                      locale={locale}
                                    />
                                  </Div>
                                );
                              })}
                            </Div>
                          </Div>
                        ))}
                      </Div>
                    </Div>
                  );
                })}
              </Div>
            </Div>

            <Div>
              <H4 className="font-semibold mb-2">
                {t("subscription.overview.costs.features.title")}
              </H4>
              <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                  <Span>
                    {t("subscription.overview.costs.features.searchLabel")}
                  </Span>
                  <Span className="font-mono">
                    {t("subscription.overview.costs.features.costFormat", {
                      value: FEATURE_COSTS.BRAVE_SEARCH,
                      unit: t(
                        "subscription.overview.costs.features.creditsUnit",
                      ),
                    })}
                  </Span>
                </Div>
                <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                  <Span>
                    {t("subscription.overview.costs.features.fetchUrlLabel")}
                  </Span>
                  <Span className="font-mono">
                    {t("subscription.overview.costs.features.costFormat", {
                      value: FEATURE_COSTS.FETCH_URL_CONTENT,
                      unit: t(
                        "subscription.overview.costs.features.creditsUnit",
                      ),
                    })}
                  </Span>
                </Div>
                <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                  <Span>
                    {t("subscription.overview.costs.features.ttsLabel")}
                  </Span>
                  <Span className="font-mono">
                    {t("subscription.overview.costs.features.costFormat", {
                      value: (FEATURE_COSTS.TTS * 1000).toFixed(2),
                      unit: t(
                        "subscription.overview.costs.features.creditsUnit",
                      ),
                    })}
                  </Span>
                </Div>
                <Div className="flex items-center gap-3 p-2 rounded bg-accent">
                  <Span>
                    {t("subscription.overview.costs.features.sttLabel")}
                  </Span>
                  <Span className="font-mono">
                    {t("subscription.overview.costs.features.costFormat", {
                      value: (FEATURE_COSTS.STT * 60).toFixed(2),
                      unit: t(
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
    </MotionDiv>
  );
}
