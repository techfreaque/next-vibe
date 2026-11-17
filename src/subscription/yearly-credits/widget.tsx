/**
 * Yearly Credits - Widget
 * Web: run button and counts. CLI/MCP: one summary line.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function YearlyCreditsWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = useWidgetValue<typeof definition.POST>();

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {result
          ? t("post.widget.summary", {
              scanned: result.scanned,
              granted: result.granted,
              credits: result.credits,
            })
          : ""}
      </Pre>
    );
  }

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      <P className="text-sm text-muted-foreground">{t("post.widget.hint")}</P>
      <FormAlertWidget field={{}} />
      {result && (
        <MetricGrid columns={3}>
          <MetricCard
            label={t("post.response.scanned")}
            value={result.scanned}
            variant="muted"
          />
          <MetricCard
            label={t("post.response.granted")}
            value={result.granted}
            variant="success"
          />
          <MetricCard
            label={t("post.response.credits")}
            value={result.credits}
            variant="info"
          />
        </MetricGrid>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
