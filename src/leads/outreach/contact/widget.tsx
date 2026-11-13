/**
 * Outreach Contact - Upsert Widget
 * Web: contact fields + "this email" section. CLI/MCP: one result line.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { DateTimeFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/datetime-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { contactStatusVariant } from "../format";
import { scopedTranslation as outreachTranslation } from "../i18n";
import type definition from "./definition";

export function OutreachContactUpsertWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: tEnum } = outreachTranslation.scopedT(locale);
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const children = field.children;

  const summary = result
    ? t("contact.post.widget.saved", {
        status: tEnum(result.currentStatus),
        count: result.contactCount,
      })
    : "";

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {result
          ? [
              `${result.created ? "+" : "~"} ${result.id} · ${summary}`,
              result.warning ? `! ${result.warning}` : "",
            ]
              .filter(Boolean)
              .join("\n")
          : ""}
      </Pre>
    );
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
          {t("contact.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("contact.post.widget.hint")}
      </P>

      <SectionGroup title={t("contact.post.widget.contactSection")}>
        <Div className="flex flex-col gap-3">
          <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
            <EmailFieldWidget
              fieldName="email"
              field={withValue(children.email, undefined, null)}
            />
            <TextFieldWidget
              fieldName="name"
              field={withValue(children.name, undefined, null)}
            />
            <SelectFieldWidget
              fieldName="kind"
              field={withValue(children.kind, undefined, null)}
            />
            <SelectFieldWidget
              fieldName="status"
              field={withValue(children.status, undefined, null)}
            />
            <TextFieldWidget
              fieldName="angle"
              field={withValue(children.angle, undefined, null)}
            />
            <TextFieldWidget
              fieldName="url"
              field={withValue(children.url, undefined, null)}
            />
          </Div>
          <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
            <TextFieldWidget
              fieldName="refCode"
              field={withValue(children.refCode, undefined, null)}
            />
            <TextFieldWidget
              fieldName="channel"
              field={withValue(children.channel, undefined, null)}
            />
            <TextFieldWidget
              fieldName="campaignLinkId"
              field={withValue(children.campaignLinkId, undefined, null)}
            />
          </Div>
          <TextareaFieldWidget
            fieldName="notes"
            field={withValue(children.notes, undefined, null)}
          />
          <BooleanFieldWidget
            fieldName="forceStatus"
            field={withValue(children.forceStatus, undefined, null)}
          />
        </Div>
      </SectionGroup>

      <SectionGroup title={t("contact.post.widget.touchSection")}>
        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            fieldName="subject"
            field={withValue(children.subject, undefined, null)}
          />
          <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
            <SelectFieldWidget
              fieldName="direction"
              field={withValue(children.direction, undefined, null)}
            />
            <DateTimeFieldWidget
              fieldName="at"
              field={withValue(children.at, undefined, null)}
            />
          </Div>
          <TextFieldWidget
            fieldName="touchNote"
            field={withValue(children.touchNote, undefined, null)}
          />
        </Div>
      </SectionGroup>

      <FormAlertWidget field={{}} />
      {result && (
        <Div className="flex items-center gap-2 flex-wrap rounded-lg border px-3 py-2">
          <StatusPill
            status={result.currentStatus}
            label={tEnum(result.currentStatus)}
            variant={contactStatusVariant(result.currentStatus)}
          />
          <Span className="text-sm text-muted-foreground">{summary}</Span>
          {result.warning && (
            <Span className="text-sm font-medium text-destructive">
              {result.warning}
            </Span>
          )}
        </Div>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "contact.post.widget.submit" as const }}
      />
    </Div>
  );
}
