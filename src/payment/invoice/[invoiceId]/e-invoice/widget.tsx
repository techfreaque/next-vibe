/**
 * Invoice E-Invoice Widget
 * Web: status, download and XML preview. CLI/MCP: XML or the missing fields.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe/ui/components/collapsible";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Li } from "next-vibe/ui/components/li";
import { Pre } from "next-vibe/ui/components/pre";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DocumentTextExportButton } from "@/finance/document-text-export";

import type definition from "./definition";

export function InvoiceEInvoiceWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const { pop, canGoBack } = useWidgetNavigation();

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {data
          ? data.ready
            ? data.xml
            : [
                `${data.fileName}: ${t("widget.missing")}`,
                ...data.missingFields.map(
                  (missing) => `- ${missing.field} ${missing.label}`,
                ),
              ].join("\n")
          : ""}
      </Pre>
    );
  }

  const backButton = canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => pop()}
      className="self-start gap-1.5 -ml-1"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {t("widget.back")}
    </Button>
  ) : undefined;

  if (!data?.fileName) {
    return (
      <WidgetShell layout="page">
        {backButton}
        <WidgetHeader
          size="page"
          title={t("title")}
          subtitle={t("description")}
        />
        <EntityPickerFieldWidget
          fieldName="invoiceId"
          field={field.children.invoiceId}
        />
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "widget.submit" as const }}
        />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t(data.isCreditNote ? "widget.creditNote" : "widget.invoice", {
          number: data.invoiceNumber,
        })}
        subtitle={t("title")}
        backButton={backButton}
        actions={
          interactive && data.ready ? (
            <DocumentTextExportButton
              filename={data.fileName}
              content={data.xml}
              mimeType="application/xml;charset=utf-8"
              downloadLabel={t(
                data.jurisdiction === "sk-efaktura"
                  ? "widget.slovak"
                  : "widget.peppol",
              )}
              copyLabel={t("widget.copy")}
              copiedLabel={t("widget.copied")}
              copyErrorLabel={t("widget.copyFailed")}
            />
          ) : undefined
        }
      />
      <FormAlertWidget field={{}} />
      {data.ready ? (
        <ResultBanner variant="success" title={t("widget.ready")} />
      ) : (
        <ResultBanner variant="warning" title={t("widget.missing")}>
          <Ul className="flex flex-col gap-1 text-sm">
            {data.missingFields.map((missing) => (
              <Li key={missing.field}>
                {missing.label}
                <Span className="text-xs text-muted-foreground">{` (${missing.field})`}</Span>
              </Li>
            ))}
          </Ul>
        </ResultBanner>
      )}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            {t("widget.preview")}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Pre className="mt-3 max-h-[480px] overflow-auto rounded-md border bg-muted p-3 text-xs">
            {data.xml}
          </Pre>
        </CollapsibleContent>
      </Collapsible>
      {interactive && data.xrechnung && (
        <Div className="flex flex-col gap-3 border-t pt-4">
          <TextFieldWidget
            fieldName="buyerReference"
            field={field.children.buyerReference}
          />
          <SubmitButtonWidget<typeof definition.GET>
            field={{ text: "widget.submit" }}
          />
          {data.xrechnung.missingFields.length > 0 ? (
            <ResultBanner variant="warning" title={t("widget.xrechnung")}>
              <Ul className="flex flex-col gap-1 text-sm">
                {data.xrechnung.missingFields.map((missing) => (
                  <Li key={missing.field}>{missing.label}</Li>
                ))}
              </Ul>
            </ResultBanner>
          ) : (
            <DocumentTextExportButton
              filename={data.xrechnung.fileName}
              content={data.xrechnung.xml}
              mimeType="application/xml;charset=utf-8"
              downloadLabel={t("widget.xrechnung")}
              copyLabel={t("widget.copy")}
              copiedLabel={t("widget.copied")}
              copyErrorLabel={t("widget.copyFailed")}
            />
          )}
        </Div>
      )}
      <Div className="flex flex-col items-start gap-2 border-t pt-4">
        <Button type="button" variant="outline" disabled>
          {t("widget.send")}
        </Button>
        <P className="text-sm text-muted-foreground">
          {t("widget.providerNeeded")}
        </P>
      </Div>
    </WidgetShell>
  );
}
