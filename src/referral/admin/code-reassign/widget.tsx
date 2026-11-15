/**
 * Referral Code Reassign - Widget
 * Web: code + new owner + dry-run toggle, then the move preview/result.
 * CLI/MCP: one summary line plus counts.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { ReferralCodeReassignResponseOutput } from "./definition";

type ReassignT = ReturnType<
  typeof useWidgetTranslation<typeof definition.POST>
>;

function resultLines(
  result: ReferralCodeReassignResponseOutput,
  t: ReassignT,
): string {
  const pairs: Array<[string, number]> = [
    [t("post.response.referralsMoved"), result.referralsMoved],
    [t("post.response.selfReferralsKept"), result.selfReferralsKept],
    [t("post.response.linksMoved"), result.linksMoved],
    [t("post.response.linksTotal"), result.linksTotal],
  ];
  return [
    result.dryRunApplied ? t("post.widget.preview") : t("post.widget.done"),
    t("post.widget.summary", {
      code: result.reassignedCode,
      from: result.fromEmail,
      to: result.toEmail,
    }),
    pairs.map(([label, value]) => `${label}: ${value}`).join(" · "),
  ].join("\n");
}

export function ReferralCodeReassignWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result ? resultLines(result, t) : ""}</Pre>;
  }

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">{t("post.widget.hint")}</P>
      <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
        <TextFieldWidget
          fieldName="code"
          field={withValue(children.code, undefined, null)}
        />
        <TextFieldWidget
          fieldName="targetUser"
          field={withValue(children.targetUser, undefined, null)}
        />
      </Div>
      <BooleanFieldWidget
        fieldName="dryRun"
        field={withValue(children.dryRun, undefined, null)}
      />
      <FormAlertWidget field={{}} />
      {result && (
        <Div className="flex flex-col gap-3">
          <P className="text-sm font-medium">
            {result.dryRunApplied
              ? t("post.widget.preview")
              : t("post.widget.done")}{" "}
            {t("post.widget.summary", {
              code: result.reassignedCode,
              from: result.fromEmail,
              to: result.toEmail,
            })}
          </P>
          <MetricGrid columns={4}>
            <MetricCard
              label={t("post.response.referralsMoved")}
              value={result.referralsMoved}
              variant="success"
            />
            <MetricCard
              label={t("post.response.selfReferralsKept")}
              value={result.selfReferralsKept}
              variant="muted"
            />
            <MetricCard
              label={t("post.response.linksMoved")}
              value={result.linksMoved}
              variant="info"
            />
            <MetricCard
              label={t("post.response.linksTotal")}
              value={result.linksTotal}
              variant="muted"
            />
          </MetricGrid>
        </Div>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
