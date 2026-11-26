"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { BankPageHeader } from "../page-header";
import type definition from "./definition";

export function BankFollowupWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const action = form.watch("action");
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const billId = data?.billId;
  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("adjustment.followup")}
        subtitle={t("adjustment.followupHint")}
      />
      {data && (
        <ResultBanner
          title={t(
            data.released
              ? "adjustment.releaseSuccess"
              : "adjustment.draftReady",
          )}
          variant="success"
        />
      )}
      {billId && interactive && (
        <Button
          type="button"
          onClick={() => {
            void import("@/payment/bill/[billId]/get/definition").then(
              ({ default: definition }) =>
                push(definition.GET, { urlPathParams: { billId } }),
            );
          }}
        >
          {t("adjustment.openDraft")}
        </Button>
      )}
      {!data && interactive && (
        <Div className="grid gap-3 sm:grid-cols-2">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={field.children.companyId}
          />
          <TextFieldWidget fieldName="lineId" field={field.children.lineId} />
          <SelectFieldWidget fieldName="action" field={field.children.action} />
          {action === "draft" && (
            <>
              <P>{t("adjustment.draftHint")}</P>
              <EntityPickerFieldWidget
                fieldName="vendorId"
                field={field.children.vendorId}
              />
              <EntityPickerFieldWidget
                fieldName="expenseAccountId"
                field={field.children.expenseAccountId}
              />
            </>
          )}
          {action === "release" && (
            <>
              <P>{t("adjustment.releaseHint")}</P>
              <TextFieldWidget
                fieldName="expectedJournalLineId"
                field={field.children.expectedJournalLineId}
              />
              <TextFieldWidget
                fieldName="expectedMatchedAt"
                field={field.children.expectedMatchedAt}
              />
              <TextFieldWidget
                fieldName="reverseDate"
                field={field.children.reverseDate}
              />
              <TextFieldWidget
                fieldName="reason"
                field={field.children.reason}
              />
            </>
          )}
          <BooleanFieldWidget
            fieldName="confirm"
            field={field.children.confirm}
          />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text:
                action === "release"
                  ? "adjustment.release"
                  : "adjustment.confirmDraft",
            }}
          />
        </Div>
      )}
    </WidgetShell>
  );
}
