/**
 * Plan Move Notice Widget (admin)
 * Web: dry-run toggle, batch + hourly cap, preview locale, test recipient,
 * then counts, the recipients of this run and the rendered preview.
 * CLI/MCP: summary lines.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Iframe } from "next-vibe/ui/components/iframe";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { PlanMoveNoticePostResponseOutput } from "./definition";

type NoticeT = ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;

function summaryLines(
  result: PlanMoveNoticePostResponseOutput,
  t: NoticeT,
): string {
  if (result.testSentTo) {
    return [
      `${t("post.response.testSentTo")}: ${result.testSentTo}`,
      `${t("post.response.previewSubject")}: ${result.previewSubject ?? ""}`,
    ].join("\n");
  }
  return [
    result.providerLive ? t("post.widget.liveBadge") : t("post.widget.notLive"),
    [
      `${t("post.response.totalRecipients")}: ${result.totalRecipients}`,
      `${t("post.response.alreadyNotified")}: ${result.alreadyNotified}`,
      `${t("post.response.pending")}: ${result.pending}`,
      `${t("post.response.planNotSupported")}: ${result.planNotSupported}`,
      `${t("post.response.sent")}: ${result.sent}`,
      `${t("post.response.failed")}: ${result.failed}`,
      `${t("post.response.hourlyBudget")}: ${result.hourlyBudget}`,
    ].join(" · "),
    result.byLocale.map((row) => `${row.locale}: ${row.count}`).join(" · "),
    ...result.recipients.map(
      (row) =>
        `${row.email} (${row.locale}) ${row.deadline ? row.deadline.slice(0, 10) : ""}`,
    ),
  ].join("\n");
}

export function PlanMoveNoticeWidget({
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
    return <Pre>{result ? summaryLines(result, t) : ""}</Pre>;
  }

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.container.description")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "post.widget.run" }}
        />
      }
      result={
        result ? (
          <Div className="flex flex-col gap-3">
            <ResultBanner
              variant={result.providerLive ? "info" : "warning"}
              title={
                result.providerLive
                  ? t("post.widget.liveBadge")
                  : t("post.widget.dryRunBadge")
              }
              message={
                result.providerLive ? undefined : t("post.widget.notLive")
              }
            />
            <MetricGrid columns={4}>
              <MetricCard
                label={t("post.response.totalRecipients")}
                value={result.totalRecipients}
              />
              <MetricCard
                label={t("post.response.pending")}
                value={result.pending}
                variant="info"
              />
              <MetricCard
                label={t("post.response.sent")}
                value={result.sent}
                variant="success"
              />
              <MetricCard
                label={t("post.response.failed")}
                value={result.failed}
                variant={result.failed > 0 ? "danger" : "muted"}
              />
            </MetricGrid>
            {result.testSentTo ? (
              <Pre>{summaryLines(result, t)}</Pre>
            ) : result.recipients.length === 0 ? (
              <P className="m-0 text-sm text-muted-foreground">
                {t("post.widget.noRecipients")}
              </P>
            ) : (
              <Pre>{summaryLines(result, t)}</Pre>
            )}
            {result.previewHtml && (
              <Div className="overflow-hidden rounded-lg border">
                <Iframe
                  title={
                    result.previewSubject ?? t("post.response.previewHtml")
                  }
                  srcDoc={result.previewHtml}
                  sandbox=""
                  className="h-[720px] w-full bg-white"
                />
              </Div>
            )}
          </Div>
        ) : undefined
      }
    >
      <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
        <NumberFieldWidget
          fieldName="batchSize"
          field={withValue(children.batchSize, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="hourlyCap"
          field={withValue(children.hourlyCap, undefined, null)}
        />
        <TextFieldWidget
          fieldName="previewLocale"
          field={withValue(children.previewLocale, undefined, null)}
        />
        <EmailFieldWidget
          fieldName="testRecipient"
          field={withValue(children.testRecipient, undefined, null)}
        />
      </Div>
      <BooleanFieldWidget
        fieldName="dryRun"
        field={withValue(children.dryRun, undefined, null)}
      />
    </AdminForm>
  );
}
