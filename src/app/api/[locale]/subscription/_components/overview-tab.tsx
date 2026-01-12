import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  ArrowRight,
  Calendar,
  Coins,
  Info,
  Sparkles,
  Zap,
} from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import {
  FEATURE_COSTS,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/products/repository-client";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { formatPrice } from "./types";

interface OverviewTabProps {
  locale: CountryLanguage;
  subscriptionPrice: number;
  subscriptionCredits: number;
  packPrice: number;
  packCredits: number;
  freeCredits: number;
  onSwitchTab: () => void;
}

export function OverviewTab({
  locale,
  subscriptionPrice,
  subscriptionCredits,
  packPrice,
  packCredits,
  freeCredits,
  onSwitchTab,
}: OverviewTabProps): JSX.Element {
  const { t } = useTranslation();

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
            {t("app.subscription.subscription.overview.howItWorks.title")}
          </CardTitle>
          <CardDescription>
            {t(
              "app.subscription.subscription.overview.howItWorks.description",
              {
                subCredits: subscriptionCredits,
              },
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Div className="flex flex-col gap-3">
            <Div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <Div>
                <P className="font-medium text-amber-900 dark:text-amber-100">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.expiring.title",
                  )}
                </P>
                <P className="text-sm text-amber-700 dark:text-amber-300">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.expiring.description",
                    {
                      subPrice: formatPrice(subscriptionPrice, locale),
                      subCredits: subscriptionCredits,
                      modelCount: TOTAL_MODEL_COUNT,
                    },
                  )}
                </P>
              </Div>
            </Div>

            <Div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <Div>
                <P className="font-medium text-green-900 dark:text-green-100">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.permanent.title",
                  )}
                </P>
                <P className="text-sm text-green-700 dark:text-green-300">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.permanent.description",
                    {
                      packPrice: formatPrice(packPrice, locale),
                      packCredits,
                      subCredits: subscriptionCredits,
                    },
                  )}
                </P>
              </Div>
            </Div>

            <Div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <Div>
                <P className="font-medium text-blue-900 dark:text-blue-100">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.free.title",
                  )}
                </P>
                <P className="text-sm text-blue-700 dark:text-blue-300">
                  {t(
                    "app.subscription.subscription.overview.howItWorks.free.description",
                    {
                      count: freeCredits,
                    },
                  )}
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
                {t("app.subscription.subscription.overview.cta.title")}
              </H4>
              <P className="text-muted-foreground">
                {t("app.subscription.subscription.overview.cta.description", {
                  modelCount: TOTAL_MODEL_COUNT,
                })}
              </P>
            </Div>
            <Button
              size="lg"
              onClick={onSwitchTab}
              className="group flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {t("app.subscription.subscription.overview.cta.button")}
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
            {t("app.subscription.subscription.overview.costs.title")}
          </CardTitle>
          <CardDescription>
            {t("app.subscription.subscription.overview.costs.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-col gap-4">
            <Div>
              <H4 className="font-semibold mb-2">
                {t("app.subscription.subscription.overview.costs.models.title")}
              </H4>
              <Div className="flex flex-col gap-4">
                {Object.entries(modelProviders).map(
                  ([providerId, provider]) => {
                    const providerModels = Object.values(modelOptions).filter(
                      (model) => model.provider === providerId,
                    );
                    if (providerModels.length === 0) {
                      return null;
                    }
                    return (
                      <Div key={providerId}>
                        <H4 className="font-semibold mb-2 flex items-center gap-2">
                          <Icon icon={provider.icon} className="h-5 w-5" />
                          {provider.name}
                        </H4>
                        <Div className="grid grid-cols-2 gap-2 text-sm">
                          {providerModels.map((model) => {
                            const creditText =
                              model.creditCost === 1
                                ? `${model.creditCost} credit`
                                : `${model.creditCost} credits`;
                            return (
                              <Div
                                key={model.id}
                                className="flex justify-between p-2 rounded bg-accent"
                              >
                                <Span>{model.name}</Span>
                                <Span className="font-mono">{creditText}</Span>
                              </Div>
                            );
                          })}
                        </Div>
                      </Div>
                    );
                  },
                )}
              </Div>
            </Div>

            <Div>
              <H4 className="font-semibold mb-2">
                {t(
                  "app.subscription.subscription.overview.costs.features.title",
                )}
              </H4>
              <Div className="grid grid-cols-2 gap-2 text-sm">
                <Div className="flex justify-between p-2 rounded bg-accent">
                  <Span>
                    {t(
                      "app.subscription.subscription.overview.costs.features.searchLabel",
                    )}
                  </Span>
                  <Span className="font-mono">
                    {t(
                      "app.subscription.subscription.overview.costs.features.costFormat",
                      {
                        value: FEATURE_COSTS.BRAVE_SEARCH,
                        unit: t(
                          "app.subscription.subscription.overview.costs.features.creditsUnit",
                        ),
                      },
                    )}
                  </Span>
                </Div>
                <Div className="flex justify-between p-2 rounded bg-accent">
                  <Span>
                    {t(
                      "app.subscription.subscription.overview.costs.features.ttsLabel",
                    )}
                  </Span>
                  <Span className="font-mono">
                    {t(
                      "app.subscription.subscription.overview.costs.features.costFormat",
                      {
                        value: (FEATURE_COSTS.TTS * 1000).toFixed(2),
                        unit: t(
                          "app.subscription.subscription.overview.costs.features.creditsUnit",
                        ),
                      },
                    )}
                  </Span>
                </Div>
                <Div className="flex justify-between p-2 rounded bg-accent">
                  <Span>
                    {t(
                      "app.subscription.subscription.overview.costs.features.sttLabel",
                    )}
                  </Span>
                  <Span className="font-mono">
                    {t(
                      "app.subscription.subscription.overview.costs.features.costFormat",
                      {
                        value: (FEATURE_COSTS.STT * 60).toFixed(2),
                        unit: t(
                          "app.subscription.subscription.overview.costs.features.creditsUnit",
                        ),
                      },
                    )}
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
