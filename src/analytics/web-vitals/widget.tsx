"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetIsInteractive,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type definition from "./definition";
import {
  WebVitalMetric,
  type WebVitalMetricValue,
  WebVitalRating,
  type WebVitalRatingValue,
} from "./enum";

const RATING_VARIANT: Record<typeof WebVitalRatingValue, StatusPillVariant> = {
  [WebVitalRating.GOOD]: "success",
  [WebVitalRating.NEEDS_IMPROVEMENT]: "warning",
  [WebVitalRating.POOR]: "danger",
};

function formatValue(
  metric: typeof WebVitalMetricValue,
  value: number,
): string {
  if (metric === WebVitalMetric.CLS) {
    return value.toFixed(3);
  }
  return value >= 1000
    ? `${(value / 1000).toFixed(2)} s`
    : `${Math.round(value)} ms`;
}

function formatShare(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function WebVitalsReportWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={t("get.description")}
      />
      {interactive && (
        <Div className="grid gap-3 @sm:grid-cols-2 max-w-md">
          <NumberFieldWidget fieldName="days" field={field.children.days} />
          <SelectFieldWidget fieldName="device" field={field.children.device} />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      <Span className="text-sm text-muted-foreground">{t("get.targets")}</Span>
      {data && (
        <>
          <Div className="grid gap-3 @sm:grid-cols-2">
            <MetricCard label={t("get.total")} value={String(data.total)} />
            <MetricCard
              label={t("get.since")}
              value={data.since.slice(0, 10)}
            />
          </Div>
          {data.rows.length === 0 ? (
            <EmptyBlock title={t("get.empty")} />
          ) : (
            <Div className="rounded-md border">
              <Table scrollLabel={t("get.title")}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("fields.pageType")}</TableHead>
                    <TableHead>{t("fields.metric")}</TableHead>
                    <TableHead className="text-right">
                      {t("fields.p75")}
                    </TableHead>
                    <TableHead>{t("fields.rating")}</TableHead>
                    <TableHead className="text-right">
                      {t("fields.goodShare")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("fields.poorShare")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("fields.samples")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rows.map((r) => (
                    <TableRow key={`${r.pageType}-${r.metric}`}>
                      <TableCell>{t(r.pageType)}</TableCell>
                      <TableCell>{t(r.metric)}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatValue(r.metric, r.p75)}
                      </TableCell>
                      <TableCell>
                        <StatusPill
                          status={t(r.rating)}
                          variant={RATING_VARIANT[r.rating]}
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatShare(r.goodShare)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatShare(r.poorShare)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.samples}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}

export function WebVitalsIngestWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <WidgetShell>
      <WidgetHeader title={t("post.title")} subtitle={t("post.description")} />
      <FormAlertWidget field={{}} />
      {data && (
        <MetricCard label={t("post.recorded")} value={String(data.recorded)} />
      )}
    </WidgetShell>
  );
}
