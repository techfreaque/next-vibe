"use client";

import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AnalyticsRange,
  type AnalyticsRangeValue,
} from "next-vibe/unified-ui/analytics/enum";
import { scopedTranslation } from "next-vibe/unified-ui/analytics/i18n";
import type { JSX } from "react";

import { reportDay } from "./report-period";
import { ReportRangeControl } from "./report-period-control";

export function ReportAnalyticsPeriod({
  range,
  from,
  to,
  applied,
  onChange,
}: {
  range?: AnalyticsRangeValue;
  from?: string;
  to?: string;
  applied?: { from: string; to: string } | null;
  onChange: (change: {
    range: AnalyticsRangeValue;
    from: string;
    to: string;
  }) => void;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const useDraft = !range || range === AnalyticsRange.CUSTOM;
  return (
    <ReportRangeControl
      fromLabel={t("analytics.from.label")}
      toLabel={t("analytics.to.label")}
      from={useDraft ? from : applied?.from}
      to={useDraft ? to : applied?.to}
      onChange={(change) =>
        onChange({
          range: AnalyticsRange.CUSTOM,
          from: reportDay(change.from),
          to: reportDay(change.to),
        })
      }
    />
  );
}
