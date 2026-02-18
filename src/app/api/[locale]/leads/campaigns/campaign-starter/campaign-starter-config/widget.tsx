/**
 * Campaign Starter Config Custom Widget
 * Form view and success state for campaign starter configuration
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart2,
  CheckCircle,
  Play,
  Rocket,
  Settings,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";

type PutResponseOutput = typeof definition.PUT.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PutResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

function ConfigSummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <Span className="text-sm text-muted-foreground">{label}</Span>
      <Span className="text-sm font-medium tabular-nums">{value}</Span>
    </Div>
  );
}

export function CampaignStarterConfigContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation();

  const savedData = field.value?.response;
  const hasBeenSaved = savedData !== null && savedData !== undefined;
  const isPending = endpointMutations?.update?.isSubmitting;

  const DAY_NAMES: Record<number, string> = {
    1: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dayMon",
    ),
    2: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dayTue",
    ),
    3: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dayWed",
    ),
    4: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dayThu",
    ),
    5: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dayFri",
    ),
    6: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.daySat",
    ),
    7: t(
      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.daySun",
    ),
  };

  const handleViewStats = (): void => {
    void (async (): Promise<void> => {
      const statsDefs =
        await import("@/app/api/[locale]/leads/stats/definition");
      navigation.push(statsDefs.default.GET, {});
    })();
  };

  const handleViewConfig = (): void => {
    void (async (): Promise<void> => {
      const configDefs = await import("./definition");
      navigation.push(configDefs.default.GET, {});
    })();
  };

  const enabledDayLabels = (savedData?.enabledDays ?? [])
    .map((d: number) => DAY_NAMES[d] ?? String(d))
    .join(", ");

  const enabledHours = savedData?.enabledHours as
    | { start: number; end: number }
    | undefined;

  const leadsPerWeek = savedData?.leadsPerWeek as
    | Record<string, number>
    | undefined;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          {hasBeenSaved ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Settings className="h-5 w-5 text-muted-foreground" />
          )}
          <Span className="font-semibold text-base">
            {hasBeenSaved
              ? t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.titleSaved",
                )
              : t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.title",
                )}
          </Span>
        </Div>
        {isPending && (
          <Span className="text-xs text-muted-foreground animate-pulse">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.saving",
            )}
          </Span>
        )}
      </Div>

      {/* Guidance state — shown before first save */}
      {!hasBeenSaved && !isPending && (
        <Div className="rounded-lg border border-dashed bg-muted/30 p-5 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <Rocket className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.guidanceTitle",
                )}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.guidanceDescription",
                )}
              </Span>
            </Div>
          </Div>
        </Div>
      )}

      {/* Success state — shown after save */}
      {hasBeenSaved && (
        <>
          {/* Success banner */}
          <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-4 flex flex-col gap-1.5">
            <Div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <Span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.successTitle",
                )}
              </Span>
            </Div>
            <P className="text-xs text-green-600 dark:text-green-400 ml-6">
              {t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.successDescription",
              )}
            </P>
          </Div>

          {/* Saved config summary */}
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-0">
            <Span className="text-sm font-semibold mb-2">
              {t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.savedSettings",
              )}
            </Span>
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.scheduleCron",
              )}
              value={savedData.schedule ?? "—"}
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.enabled",
              )}
              value={
                savedData.enabled
                  ? t(
                      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.yes",
                    )
                  : t(
                      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.no",
                    )
              }
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.dryRun",
              )}
              value={
                savedData.dryRun
                  ? t(
                      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.yesNoEmailsSent",
                    )
                  : t(
                      "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.no",
                    )
              }
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.minLeadAge",
              )}
              value={`${savedData.minAgeHours ?? 0}h`}
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.activeDays",
              )}
              value={enabledDayLabels || "—"}
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.activeHours",
              )}
              value={
                enabledHours
                  ? `${enabledHours.start}:00 – ${enabledHours.end}:00`
                  : "—"
              }
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.priority",
              )}
              value={savedData.priority ?? "—"}
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.timeout",
              )}
              value={
                savedData.timeout !== null && savedData.timeout !== undefined
                  ? `${Math.round(savedData.timeout / 1000)}s`
                  : "—"
              }
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.retries",
              )}
              value={savedData.retries ?? "—"}
            />
            <ConfigSummaryRow
              label={t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.retryDelay",
              )}
              value={
                savedData.retryDelay !== null &&
                savedData.retryDelay !== undefined
                  ? `${Math.round(savedData.retryDelay / 1000)}s`
                  : "—"
              }
            />
            {leadsPerWeek && Object.keys(leadsPerWeek).length > 0 && (
              <Div className="pt-2 mt-1 border-t">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t(
                    "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.leadsPerWeek",
                  )}
                </Span>
                <Div className="mt-1.5 flex flex-col gap-0.5">
                  {Object.entries(leadsPerWeek).map(
                    ([localeKey, count]: [string, number]) => (
                      <Div
                        key={localeKey}
                        className="flex items-center justify-between text-xs py-0.5"
                      >
                        <Span className="text-muted-foreground font-mono">
                          {localeKey}
                        </Span>
                        <Span className="font-medium tabular-nums">
                          {count}
                        </Span>
                      </Div>
                    ),
                  )}
                </Div>
              </Div>
            )}
          </Div>

          {/* Action buttons */}
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewStats}
              className="flex items-center gap-1.5"
            >
              <BarChart2 className="h-4 w-4" />
              {t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.viewStats",
              )}
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleViewConfig}
              className="flex items-center gap-1.5"
            >
              <Play className="h-4 w-4" />
              {t(
                "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.viewCurrentConfig",
              )}
            </Button>
          </Div>
        </>
      )}
    </Div>
  );
}
