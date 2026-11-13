/**
 * Outreach Deal - Upsert Widget
 * Web: deal form. CLI/MCP: one result line.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Pre } from "next-vibe/ui/components/pre";
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
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { dealStatusVariant } from "../format";
import { scopedTranslation as outreachTranslation } from "../i18n";
import type definition from "./definition";

export function OutreachDealUpsertWidget({
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

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {result
          ? [
              `${result.created ? "+" : "~"} ${result.dealId} · ${tEnum(result.dealStatus)}`,
              result.linkFound === false
                ? `! ${t("deal.post.fields.campaignLinkId.description")}`
                : "",
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
          {t("deal.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("deal.post.widget.hint")}
      </P>
      <Div className="flex flex-col gap-3">
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <EmailFieldWidget
            fieldName="contactEmail"
            field={withValue(children.contactEmail, undefined, null)}
          />
          <TextFieldWidget
            fieldName="contactName"
            field={withValue(children.contactName, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="deliverable"
          field={withValue(children.deliverable, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
          <NumberFieldWidget
            fieldName="amount"
            field={withValue(children.amount, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="currency"
            field={withValue(children.currency, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="status"
            field={withValue(children.status, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="channel"
            field={withValue(children.channel, undefined, null)}
          />
          <TextFieldWidget
            fieldName="refCode"
            field={withValue(children.refCode, undefined, null)}
          />
          <TextFieldWidget
            fieldName="utmCampaign"
            field={withValue(children.utmCampaign, undefined, null)}
          />
          <TextFieldWidget
            fieldName="campaignLinkId"
            field={withValue(children.campaignLinkId, undefined, null)}
          />
          <DateFieldWidget
            fieldName="liveAt"
            field={withValue(children.liveAt, undefined, null)}
          />
          <DateFieldWidget
            fieldName="paidAt"
            field={withValue(children.paidAt, undefined, null)}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="notes"
          field={withValue(children.notes, undefined, null)}
        />
      </Div>
      <FormAlertWidget field={{}} />
      {result && (
        <Div className="flex items-center gap-2">
          <StatusPill
            status={result.dealStatus}
            label={tEnum(result.dealStatus)}
            variant={dealStatusVariant(result.dealStatus)}
          />
        </Div>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "deal.post.widget.submit" as const }}
      />
    </Div>
  );
}
