"use client";

import { Button } from "next-vibe/ui/components/button";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";

import { toIntlLocale } from "../../../core/i18n/core/language-utils";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { PulseHealthStatus, PulseHealthStatusDB } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type definition from "./definition";

const variants = {
  [PulseHealthStatus.HEALTHY]: "success",
  [PulseHealthStatus.WARNING]: "warning",
  [PulseHealthStatus.CRITICAL]: "danger",
  [PulseHealthStatus.UNKNOWN]: "muted",
} as const;

export function PulseStatusWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const submitting = useWidgetIsSubmitting();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const { t: taskT } = scopedTranslation.scopedT(locale);
  const status =
    PulseHealthStatusDB.find((value) => value === data?.status) ??
    PulseHealthStatus.UNKNOWN;
  const displayLocale = toIntlLocale(locale);

  const last = data?.lastPulseAt;
  const lastRun = last ? new Date(last) : undefined;
  const formattedRun =
    lastRun && Number.isFinite(lastRun.getTime())
      ? new Intl.DateTimeFormat(displayLocale, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(lastRun)
      : t("get.widget.noData");
  const successRate = data?.successRate;
  const formattedSuccessRate =
    successRate === null || successRate === undefined
      ? t("get.widget.noData")
      : new Intl.NumberFormat(displayLocale, {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(successRate / 10_000);

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={t("get.description")}
        titleAccessory={
          data && (
            <StatusPill status={taskT(status)} variant={variants[status]} />
          )
        }
        actions={
          interactive &&
          read && (
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full @lg:w-auto"
              disabled={submitting}
              onClick={() => void read.refetch()}
            >
              {t("get.widget.refresh")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {data ? (
        <MetricGrid columns={3}>
          <MetricCard
            label={t("get.fields.totalExecutions.label")}
            value={new Intl.NumberFormat(displayLocale).format(
              data.totalExecutions,
            )}
          />
          <MetricCard
            label={t("get.fields.successRate.label")}
            value={formattedSuccessRate}
          />
          <MetricCard
            label={t("get.fields.lastPulseAt.label")}
            value={formattedRun}
          />
        </MetricGrid>
      ) : (
        response?.success !== false && <LoadingBlock message={t("get.title")} />
      )}
    </WidgetShell>
  );
}
