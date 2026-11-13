/**
 * Outreach Import - Widget
 * Web: paste box / server files + result counts. CLI/MCP: count lines.
 */

"use client";

import { Platform, isCliPlatform } from "next-vibe/platforms/platforms";
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
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { OutreachImportResponseOutput } from "./definition";

type ImportT = ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;

function resultLines(result: OutreachImportResponseOutput, t: ImportT): string {
  const pairs: Array<[string, number]> = [
    [t("import.post.response.rowsParsed"), result.rowsParsed],
    [t("import.post.response.contactsCreated"), result.contactsCreated],
    [t("import.post.response.contactsUpdated"), result.contactsUpdated],
    [t("import.post.response.touchesAdded"), result.touchesAdded],
    [t("import.post.response.touchesDuplicate"), result.touchesDuplicate],
    [t("import.post.response.statusChanges"), result.statusChanges],
    [t("import.post.response.skipped"), result.skipped],
  ];
  return [
    pairs.map(([label, value]) => `${label}: ${value}`).join(" · "),
    ...result.skippedLines.map((line) => `  - ${line}`),
  ].join("\n");
}

export function OutreachImportWidget({
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
          {t("import.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("import.post.widget.hint")}
      </P>
      <Div className="flex flex-col gap-3">
        <TextareaFieldWidget
          fieldName="content"
          field={withValue(children.content, undefined, null)}
        />
        <TextFieldWidget
          fieldName="filePaths"
          field={withValue(children.filePaths, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
          <Div className="@sm:col-span-2">
            <TextFieldWidget
              fieldName="ignoreEmails"
              field={withValue(children.ignoreEmails, undefined, null)}
            />
          </Div>
          <BooleanFieldWidget
            fieldName="dryRun"
            field={withValue(children.dryRun, undefined, null)}
          />
        </Div>
      </Div>
      <FormAlertWidget field={{}} />
      {result && (
        <Div className="flex flex-col gap-3">
          <MetricGrid columns={4}>
            <MetricCard
              label={t("import.post.response.contactsCreated")}
              value={result.contactsCreated}
              variant="success"
            />
            <MetricCard
              label={t("import.post.response.contactsUpdated")}
              value={result.contactsUpdated}
              variant="info"
            />
            <MetricCard
              label={t("import.post.response.touchesAdded")}
              value={result.touchesAdded}
            />
            <MetricCard
              label={t("import.post.response.touchesDuplicate")}
              value={result.touchesDuplicate}
              variant="muted"
            />
          </MetricGrid>
          {result.skippedLines.length > 0 && (
            <Pre className="text-xs text-muted-foreground">
              {result.skippedLines.join("\n")}
            </Pre>
          )}
        </Div>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "import.post.widget.submit" as const }}
      />
    </Div>
  );
}
