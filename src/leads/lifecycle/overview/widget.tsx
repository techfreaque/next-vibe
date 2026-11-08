/**
 * Lifecycle Overview Widget
 * Kill switch state, per-journey enrollment / send / conversion counts,
 * and entry points for settings and the backfill.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Pause } from "next-vibe/ui/components/icons/Pause";
import { Play } from "next-vibe/ui/components/icons/Play";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React from "react";

import { LifecycleJourney, type LifecycleJourneyValue } from "../enum";
import { scopedTranslation } from "../i18n";
import type definition from "./definition";

type LifecycleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function journeyLabel(
  t: LifecycleT,
  journey: typeof LifecycleJourneyValue,
): string {
  switch (journey) {
    case LifecycleJourney.INACTIVE_USER:
      return t("enums.journey.inactiveUser");
    case LifecycleJourney.ENGAGED_FREE:
      return t("enums.journey.engagedFree");
    case LifecycleJourney.NEWSLETTER_INVITE:
      return t("enums.journey.newsletterInvite");
  }
}

export function LifecycleOverviewWidget(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();

  const openSettings = React.useCallback(
    (paused: boolean | undefined): void => {
      void (async (): Promise<void> => {
        const m = await import("../settings/definition");
        navigate(m.default.POST, {
          data: paused === undefined ? {} : { paused },
          renderInModal: true,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const openBackfill = React.useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../backfill/definition");
      navigate(m.default.POST, {
        data: { dryRun: true, spreadHours: 72 },
        renderInModal: true,
      });
    })();
  }, [navigate]);

  const paused = data?.paused ?? true;
  const journeys = data?.journeys ?? [];

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("widget.title")}
        actions={
          <Div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openSettings(undefined)}
            >
              <Span>{t("widget.settings")}</Span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openBackfill}
            >
              <Span>{t("widget.backfill")}</Span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => endpointMutations?.read?.refetch?.()}
              title={t("widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </Div>
        }
      />

      <ResultBanner
        variant={paused ? "warning" : "success"}
        icon={
          paused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
        }
        title={paused ? t("widget.pausedTitle") : t("widget.liveTitle")}
        message={paused ? t("widget.pausedBody") : t("widget.liveBody")}
      >
        <Div className="flex flex-col gap-2 mt-2">
          {data && (
            <Span className="text-xs text-muted-foreground">
              {t("widget.capLine", {
                hours: data.minHoursBetweenEmails,
                max: data.maxSendsPerRun,
              })}{" "}
              {data.requireUserMarketingConsent
                ? t("widget.consentOn")
                : t("widget.consentOff")}
            </Span>
          )}
          <Div>
            <Button
              type="button"
              size="sm"
              variant={paused ? "default" : "destructive"}
              onClick={() => openSettings(!paused)}
            >
              {paused ? t("widget.resume") : t("widget.pause")}
            </Button>
          </Div>
        </Div>
      </ResultBanner>

      {journeys.length === 0 && (
        <Span className="text-sm text-muted-foreground">
          {t("widget.noJourneys")}
        </Span>
      )}

      {journeys.map((j) => (
        <SectionGroup
          key={j.journey}
          title={`${journeyLabel(t, j.journey)} · ${t("widget.stepsLine", { steps: j.steps })}`}
        >
          <MetricGrid columns={3}>
            <MetricCard label={t("widget.enrolled")} value={j.enrolled} />
            <MetricCard
              label={t("widget.active")}
              value={j.active}
              variant="info"
            />
            <MetricCard label={t("widget.sent")} value={j.sent} />
            <MetricCard label={t("widget.sent24h")} value={j.sent24h} />
            <MetricCard
              label={t("widget.converted")}
              value={j.converted}
              variant="success"
            />
            <MetricCard
              label={t("widget.paid")}
              value={j.attributedPaid}
              variant="success"
            />
            <MetricCard
              label={t("widget.unsubscribed")}
              value={j.unsubscribed}
              variant="warning"
            />
          </MetricGrid>
        </SectionGroup>
      ))}
    </WidgetShell>
  );
}
