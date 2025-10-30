/**
 * A/B Testing Client Component
 * Displays and manages A/B testing configuration for email campaigns
 */

import { BarChart3, Settings, TestTube, Users } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui";
import { H2, H3, H4, P } from "next-vibe-ui/ui";
import { Progress } from "next-vibe-ui/ui/progress";
import type { CSSProperties, JSX } from "react";

import { getABTestSummary } from "@/app/api/[locale]/v1/core/leads/campaigns/emails/services/ab-testing";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ABTestingClientProps {
  locale: CountryLanguage;
}

export function ABTestingClient({ locale }: ABTestingClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const abTestSummary = getABTestSummary();

  return (
    <Div className="space-y-6">
      {/* Header with refresh button */}
      <Div className="flex justify-between items-center">
        <Div>
          <H2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("app.admin.leads.leads.admin.abTesting.title")}
          </H2>
          <P className="text-gray-600 dark:text-gray-400">
            {t("app.admin.leads.leads.admin.abTesting.subtitle")}
          </P>
        </Div>
      </Div>

      {/* A/B Test Status Overview */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.abTesting.metrics.testStatus")}
            </CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {abTestSummary.enabled ? (
                <Badge variant="default" className="bg-green-500">
                  {t("app.admin.leads.leads.admin.abTesting.status.active")}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {t("app.admin.leads.leads.admin.abTesting.status.inactive")}
                </Badge>
              )}
            </Div>
            <P className="text-xs text-muted-foreground">
              {abTestSummary.enabled
                ? t(
                    "app.admin.leads.leads.admin.abTesting.descriptions.enabled",
                  )
                : t(
                    "app.admin.leads.leads.admin.abTesting.descriptions.disabled",
                  )}
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.abTesting.metrics.totalVariants")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {abTestSummary.totalVariants}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t(
                "app.admin.leads.leads.admin.abTesting.descriptions.emailJourneyVariants",
              )}
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.leads.leads.admin.abTesting.metrics.configuration")}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Div className="text-2xl font-bold">
              {abTestSummary.isValid ? (
                <Badge variant="default" className="bg-green-500">
                  {t("app.admin.leads.leads.admin.abTesting.status.valid")}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {t("app.admin.leads.leads.admin.abTesting.status.invalid")}
                </Badge>
              )}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t(
                "app.admin.leads.leads.admin.abTesting.descriptions.configurationStatus",
              )}
            </P>
          </CardContent>
        </Card>
      </Div>

      {/* Variant Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("app.admin.leads.leads.admin.abTesting.variants.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="space-y-6">
            {abTestSummary.variants.map((variant) => (
              <Div key={variant.id} className="border rounded-lg p-4 space-y-4">
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center gap-3">
                    <Div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: variant.metadata.color }}
                    />
                    <Div>
                      <H3 className="font-semibold text-lg">
                        {variant.metadata.name}
                      </H3>
                      <P className="text-sm text-gray-600 dark:text-gray-400">
                        {variant.metadata.description}
                      </P>
                    </Div>
                  </Div>
                  <Div className="text-right">
                    <Div className="text-2xl font-bold">
                      {variant.weight.toFixed(1)}%
                    </Div>
                    <Div className="text-sm text-gray-500">
                      {t(
                        "app.admin.leads.leads.admin.abTesting.metrics.trafficSplit",
                      )}
                    </Div>
                  </Div>
                </Div>

                {/* Progress bar showing weight distribution */}
                <Div className="space-y-2">
                  <Div className="flex justify-between text-sm">
                    <P>
                      {t(
                        "app.admin.leads.leads.admin.abTesting.metrics.trafficAllocation",
                      )}
                    </P>
                    <P>{variant.weight.toFixed(1)}%</P>
                  </Div>
                  <Progress
                    value={variant.weight}
                    className="h-2"
                    style={
                      {
                        "--progress-background": variant.metadata.color,
                      } as CSSProperties
                    }
                  />
                </Div>

                {/* Variant characteristics */}
                <Div className="space-y-2">
                  <H4 className="font-medium text-sm">
                    {t(
                      "app.admin.leads.leads.admin.abTesting.variants.keyCharacteristics",
                    )}
                  </H4>
                  <Div className="flex flex-wrap gap-2">
                    {variant.metadata.characteristics.map((characteristic) => (
                      <Badge
                        key={characteristic}
                        variant="outline"
                        className="text-xs"
                      >
                        {characteristic}
                      </Badge>
                    ))}
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("app.admin.leads.leads.admin.abTesting.config.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Div>
              <H4 className="font-medium mb-2">
                {t(
                  "app.admin.leads.leads.admin.abTesting.config.testConfiguration",
                )}
              </H4>
              <Div className="space-y-2 text-sm">
                <Div className="flex justify-between">
                  <P>
                    {t("app.admin.leads.leads.admin.abTesting.config.status")}:
                  </P>
                  <P
                    className={
                      abTestSummary.enabled ? "text-green-600" : "text-gray-500"
                    }
                  >
                    {abTestSummary.enabled
                      ? t(
                          "app.admin.leads.leads.admin.abTesting.config.enabled",
                        )
                      : t(
                          "app.admin.leads.leads.admin.abTesting.config.disabled",
                        )}
                  </P>
                </Div>
                <Div className="flex justify-between">
                  <P>
                    {t(
                      "app.admin.leads.leads.admin.abTesting.metrics.totalVariants",
                    )}
                    :
                  </P>
                  <P>{abTestSummary.totalVariants}</P>
                </Div>
                <Div className="flex justify-between">
                  <P>
                    {t(
                      "app.admin.leads.leads.admin.abTesting.config.configurationValid",
                    )}
                    :
                  </P>
                  <P
                    className={
                      abTestSummary.isValid ? "text-green-600" : "text-red-600"
                    }
                  >
                    {abTestSummary.isValid
                      ? t("app.admin.leads.leads.admin.abTesting.config.yes")
                      : t("app.admin.leads.leads.admin.abTesting.config.no")}
                  </P>
                </Div>
              </Div>
            </Div>

            <Div>
              <H4 className="font-medium mb-2">
                {t(
                  "app.admin.leads.leads.admin.abTesting.config.trafficDistribution",
                )}
              </H4>
              <Div className="space-y-2 text-sm">
                {abTestSummary.variants.map((variant) => (
                  <Div key={variant.id} className="flex justify-between">
                    <P>{variant.metadata.name}:</P>
                    <P>{variant.weight.toFixed(1)}%</P>
                  </Div>
                ))}
                <Div className="border-t pt-2 font-medium">
                  <Div className="flex justify-between">
                    <P>
                      {t("app.admin.leads.leads.admin.abTesting.config.total")}:
                    </P>
                    <P>
                      {abTestSummary.variants
                        .reduce((sum, v) => sum + v.weight, 0)
                        .toFixed(1)}
                      %
                    </P>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}
