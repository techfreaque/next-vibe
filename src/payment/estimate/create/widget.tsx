"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  formatMoney,
  formatMoneyAmount,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import { DocumentDraftLines } from "@/finance/document-draft-lines";
import { DocumentVatPicker } from "@/finance/document-vat-picker";
import { useDocumentVatRates } from "@/finance/document-vat-rates";
import {
  LINE_SETTLEMENT_V1,
  supportsLineCentSettlement,
} from "@/tax/line-settlement";

import { calculateInvoiceLine } from "../../invoice/line/amounts";
import type definition from "./definition";

export function EstimateCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const form = useWidgetForm<typeof definition.POST>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  const lineValues = useWatch({ control: form.control, name: "lines" });
  const watched = Array.isArray(lineValues) ? lineValues : [];
  const disabled = useWidgetDisabled();
  const locale = useWidgetLocale();
  const [currency, companyId] = useWatch({
    control: form.control,
    name: ["currency", "companyId"],
  });
  const interactive = useWidgetIsInteractive();
  const vatRates = useDocumentVatRates(
    companyId,
    interactive && !data?.estimate,
  );
  const workspace = useWorkspaceCompany();
  const denomination =
    currency ??
    workspace?.companies.find((company) => company.id === companyId)?.currency;
  const money = (n: number): string =>
    denomination
      ? formatMoney(n, denomination, locale)
      : formatMoneyAmount(n, locale);
  const settlement =
    denomination && supportsLineCentSettlement(denomination)
      ? LINE_SETTLEMENT_V1
      : undefined;
  const calculated = watched.map((line) =>
    calculateInvoiceLine(
      {
        quantity: line.quantity ?? 1,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate ?? 0,
      },
      settlement,
    ),
  );
  const gross = calculated.reduce(
    (total, line) => total + Math.round(line.lineTotal * 10000),
    0,
  );
  const vat = calculated.reduce(
    (total, line) => total + Math.round(line.taxAmount * 10000),
    0,
  );
  const handleView = (estimateId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[estimateId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { estimateId },
      });
    })();
  };

  if (data?.estimate) {
    return (
      <WidgetShell layout="page">
        <ResultBanner
          variant="success"
          title={t("post.response.success")}
          message={`${data.estimate.estimateNumber} · ${formatMoney(data.estimate.total, data.estimate.currency, locale)}`}
        >
          <Button
            size="sm"
            type="button"
            onClick={() => handleView(data.estimate.id)}
          >
            {t("post.widget.viewButton")}
          </Button>
        </ResultBanner>
      </WidgetShell>
    );
  }
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("post.widget.back")}
            </Button>
          )
        }
        actions={
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "post.widget.submit" }}
          />
        }
      />
      <FormAlertWidget field={{}} />
      <SectionGroup title={t("post.response.estimate.title")}>
        <Div className="grid min-w-0 gap-3 @md:grid-cols-2">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />

          <EntityPickerFieldWidget
            fieldName="customerId"
            field={withValue(field.children.customerId, undefined, null)}
          />
          <TextFieldWidget
            fieldName="customerEmail"
            field={withValue(field.children.customerEmail, undefined, null)}
          />

          <TextFieldWidget
            fieldName="customerName"
            field={withValue(field.children.customerName, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="currency"
            field={field.children.currency}
          />
          <DateFieldWidget
            fieldName="validUntil"
            utcCalendarDay
            field={withValue(field.children.validUntil, undefined, null)}
          />
          <TextFieldWidget
            fieldName="title"
            field={withValue(field.children.title, undefined, null)}
          />
          <TextFieldWidget
            fieldName="notes"
            field={withValue(field.children.notes, undefined, null)}
          />
          <TextFieldWidget
            fieldName="terms"
            field={withValue(field.children.terms, undefined, null)}
          />
        </Div>
      </SectionGroup>
      <DocumentDraftLines
        locale={locale}
        disabled={disabled}
        maxLines={500}
        labels={{
          title: t("lines.label"),
          description: t("post.widget.item"),
          quantity: t("post.widget.quantity"),
          unitPrice: t("post.widget.price"),
          taxRate: t("post.widget.vatRate"),
          total: t("post.response.estimate.total"),
          add: t("post.widget.add"),
          remove: t("post.widget.remove"),
          empty: t("post.widget.empty"),
          invalid: t("post.errors.validation.description"),
        }}
        rows={fields.map((row, i) => {
          const line = watched[i] ?? row;
          const errors = form.formState.errors.lines?.[i];
          const taxControl = (
            <DocumentVatPicker
              rates={vatRates}
              value={line.taxRate ?? 0}
              label={t("post.widget.vatRate")}
              manualLabel={t("post.widget.otherRate")}
              disabled={disabled}
              invalid={Boolean(errors?.taxRate)}
              onChange={(value) =>
                form.setValue(`lines.${i}.taxRate`, value, {
                  shouldDirty: true,
                })
              }
            />
          );
          return {
            id: row.id,
            description: line.description,
            quantity: line.quantity ?? 1,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate ?? 0,
            formattedTotal: money(calculated[i]?.lineTotal ?? 0),
            taxControl,
            errors: {
              description: Boolean(errors?.description),
              quantity: Boolean(errors?.quantity),
              unitPrice: Boolean(errors?.unitPrice),
              taxRate: Boolean(errors?.taxRate),
            },
          };
        })}
        onAdd={() =>
          append({ description: "", quantity: 1, unitPrice: 0, taxRate: 0 })
        }
        onRemove={remove}
        onNumber={(i, key, value) =>
          form.setValue(`lines.${i}.${key}`, value, { shouldDirty: true })
        }
        onDescription={(i, desc) =>
          form.setValue(`lines.${i}.description`, desc, { shouldDirty: true })
        }
      />
      <SectionGroup title={t("post.widget.summary")}>
        <DetailGrid columns={3}>
          <DetailField
            label={t("post.response.estimate.subtotal")}
            value={money((gross - vat) / 10000)}
          />
          <DetailField
            label={t("post.response.estimate.taxAmount")}
            value={money(vat / 10000)}
          />
          <DetailField
            label={t("post.response.estimate.total")}
            value={money(gross / 10000)}
          />
        </DetailGrid>
      </SectionGroup>
    </WidgetShell>
  );
}
