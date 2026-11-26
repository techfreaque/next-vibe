/**
 * Yearly Credits Backfill - Widget
 * Web: dry-run toggle, totals, one line per subscription.
 * CLI/MCP: summary line plus one line per subscription.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { YearlyCreditsBackfillResponseOutput } from "./definition";

type BackfillT = ReturnType<
  typeof useWidgetTranslation<typeof definition.POST>
>;

function reportLines(
  result: YearlyCreditsBackfillResponseOutput,
  t: BackfillT,
): string {
  return [
    t(
      result.dryRunApplied ? "backfill.widget.preview" : "backfill.widget.done",
      {
        subscriptions: result.subscriptions,
        months: result.months,
        credits: result.credits,
      },
    ),
    ...result.rows.map(
      (row) =>
        `${row.status.padEnd(14)} ${row.userEmail}  ${row.plan}  ${row.periodStart.slice(0, 10)} -> ${row.periodEnd.slice(0, 10)}  month ${row.currentMonth}  missed ${row.missedMonths}  +${row.credits}`,
    ),
  ].join("\n");
}

export function YearlyCreditsBackfillWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = useWidgetValue<typeof definition.POST>();
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result ? reportLines(result, t) : ""}</Pre>;
  }

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("backfill.title")}
        subtitle={t("backfill.widget.hint")}
      />
      <Div className="flex flex-col gap-4 rounded-xl border bg-card p-4 @md:flex-row @md:items-center @md:justify-between">
        <BooleanFieldWidget
          fieldName="dryRun"
          field={withValue(children.dryRun, undefined, null)}
        />
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "backfill.widget.submit" as const }}
        />
      </Div>
      <FormAlertWidget field={{}} />
      {result && (
        <Div className="flex flex-col gap-3">
          <MetricGrid columns={3}>
            <MetricCard
              label={t("backfill.response.subscriptions")}
              value={result.subscriptions}
              variant="muted"
            />
            <MetricCard
              label={t("backfill.response.months")}
              value={result.months}
              variant="info"
            />
            <MetricCard
              label={t("backfill.response.credits")}
              value={result.credits}
              variant="success"
            />
          </MetricGrid>
          <Pre>{reportLines(result, t)}</Pre>
        </Div>
      )}
    </WidgetShell>
  );
}
