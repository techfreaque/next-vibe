/**
 * Referral Code Reassign - Widget
 * Web: code + new owner + dry-run toggle, then the move preview/result.
 * CLI/MCP: one summary line plus counts.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
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
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result ? resultLines(result, t) : ""}</Pre>;
  }

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.widget.hint")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "post.widget.submit" }}
        />
      }
      result={
        result ? (
          <Div className="flex flex-col gap-3">
            <ResultBanner
              variant={result.dryRunApplied ? "info" : "success"}
              title={
                result.dryRunApplied
                  ? t("post.widget.preview")
                  : t("post.widget.done")
              }
              message={t("post.widget.summary", {
                code: result.reassignedCode,
                from: result.fromEmail,
                to: result.toEmail,
              })}
            />
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
        ) : undefined
      }
    >
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
    </AdminForm>
  );
}
