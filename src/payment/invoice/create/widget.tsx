"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatMoney,
  formatMoneyAmount,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef } from "react";
import { useController, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";

import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import companyDefinition from "@/companies/[companyId]/get/definition";
import { DocumentDraftLines } from "@/finance/document-draft-lines";
import { DocumentScopePicker } from "@/finance/document-list-ui";
import { DocumentVatPicker } from "@/finance/document-vat-picker";
import { useDocumentVatPolicy } from "@/finance/document-vat-rates";
import {
  LINE_SETTLEMENT_V1,
  supportsLineCentSettlement,
} from "@/tax/line-settlement";
import customerDefinition from "@/users/user/[id]/definition";

import { calculateInvoiceLine } from "../line/amounts";
import type definition from "./definition";

export function InvoiceCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { canGoBack, pop, push } = useWidgetNavigation();
  const disabled = useWidgetDisabled();
  const isSubmitting = useWidgetIsSubmitting();
  const response = useWidgetResponse();
  const saveError = response?.success === false ? response : undefined;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const lineItems = useFieldArray({ control: form.control, name: "lineItems" });
  const lineValues = useWatch({ control: form.control, name: "lineItems" });
  const watchedLines = useMemo(() => lineValues ?? [], [lineValues]);
  const currency = useWatch({ control: form.control, name: "currency" });
  const { field: companyField, fieldState: companyFieldState } = useController({
    control: form.control,
    name: "companyId",
  });
  const { field: customerField, fieldState: customerFieldState } =
    useController({
      control: form.control,
      name: "customerId",
    });
  const companyId = companyField.value;
  const customerId = customerField.value;
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const workspace = useWorkspaceCompany();
  const workspaceCompany = workspace?.companies.find(
    ({ id }) => id === companyId,
  );
  // A picker selection can be newer than the workspace's initial list.
  const readCompany =
    interactive &&
    !data?.invoice?.id &&
    Boolean(companyId) &&
    !workspaceCompany &&
    (workspace === null || companyFieldState.isDirty);
  const companyOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { companyId },
        queryOptions: { enabled: readCompany },
      },
    }),
    [companyId, readCompany],
  );
  const companyRead = useEndpoint(
    companyDefinition,
    companyOptions,
    logger,
    user,
  ).read;
  const company =
    workspaceCompany ?? (readCompany ? companyRead?.data : undefined);
  // The picker already knows the chosen name. Resolve prefilled IDs through the
  // authorized customer read, and keep a selected-state label on failure.
  const displayCustomerId = data?.invoice?.customerId ?? customerId;
  const readCustomer =
    interactive &&
    Boolean(displayCustomerId) &&
    (Boolean(data?.invoice?.id) || !customerFieldState.isDirty);
  const customerOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { id: displayCustomerId ?? "" },
        queryOptions: { enabled: readCustomer },
      },
    }),
    [displayCustomerId, readCustomer],
  );
  const customerRead = useEndpoint(
    customerDefinition,
    customerOptions,
    logger,
    user,
  ).read;
  const selectedCustomer =
    readCustomer &&
    customerRead?.data?.userProfile.basicInfo.id === displayCustomerId
      ? customerRead.data
      : undefined;
  const selectedCustomerLabel = customerId
    ? selectedCustomer?.privateName || t("post.widget.customerSelected")
    : undefined;
  const { choices: vatRates, exemptionNotice } = useDocumentVatPolicy(
    companyId,
    interactive && !data?.invoice?.id,
  );
  const companyCurrency = z.enum(CurrenciesArr).safeParse(company?.currency);
  const effectiveCurrency =
    currency ??
    (company && company.id === companyId
      ? companyCurrency.success
        ? companyCurrency.data
        : "EUR"
      : undefined);
  const initializedDueDate = useRef(false);
  useEffect(() => {
    if (!interactive || data?.invoice?.id || initializedDueDate.current) {
      return;
    }
    initializedDueDate.current = true;
    if (!form.getValues("dueDate")) {
      const due = new Date();
      due.setUTCDate(due.getUTCDate() + 30);
      due.setUTCHours(0, 0, 0, 0);
      form.setValue("dueDate", due);
    }
  }, [data?.invoice?.id, form, interactive]);
  useEffect(() => {
    if (exemptionNotice && interactive) {
      watchedLines.forEach((line, index) => {
        if (line.taxRate) {
          form.setValue(`lineItems.${index}.taxRate`, 0, { shouldDirty: true });
        }
      });
    }
  }, [exemptionNotice, form, interactive, watchedLines]);
  const lineSettlement = supportsLineCentSettlement(effectiveCurrency ?? "EUR")
    ? LINE_SETTLEMENT_V1
    : undefined;
  const amounts = watchedLines.map((line) =>
    calculateInvoiceLine(line, lineSettlement),
  );
  const hasIncompleteAmounts = amounts.some(
    (line) => !Number.isFinite(line.lineTotal),
  );
  const totalUnits = amounts.reduce(
    (sum, line) => sum + Math.round(line.lineTotal * 10_000),
    0,
  );
  const vatUnits = amounts.reduce(
    (sum, line) => sum + Math.round(line.taxAmount * 10_000),
    0,
  );
  const totalCents = Math.round(totalUnits / 100);
  const vatCents = Math.round(vatUnits / 100);
  const money = (amount: number): string =>
    effectiveCurrency
      ? formatMoney(amount, effectiveCurrency, locale)
      : formatMoneyAmount(amount, locale);
  const handleView = (invoiceId: string): void => {
    void import("../[invoiceId]/get/definition").then((module) => {
      push(module.default.GET, { urlPathParams: { invoiceId } });
      return undefined;
    });
  };

  if (data?.invoice) {
    return (
      <WidgetShell layout="page">
        <ResultBanner
          variant="success"
          title={
            data.invoice.invoiceSequenceNumber !== null
              ? t("post.widget.draftSavedNumber", {
                  number: data.invoice.invoiceSequenceNumber,
                })
              : t("post.widget.draftSaved")
          }
          message={formatMoney(
            data.invoice.amount,
            data.invoice.currency,
            locale,
          )}
        >
          <Div className="flex min-w-0 flex-col items-start gap-3">
            {selectedCustomer?.privateName && (
              <P className="text-sm">{selectedCustomer.privateName}</P>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => handleView(data.invoice.id)}
            >
              {t("post.widget.viewButton")}
            </Button>
          </Div>
        </ResultBanner>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.widget.draftHint")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("post.widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: saveError ? "post.widget.retrySave" : "post.widget.submit",
              loadingText: "post.widget.saving",
            }}
          />
        }
      />
      {isSubmitting && (
        <Div aria-live="polite" className="text-sm font-medium">
          {t("post.widget.saving")}
        </Div>
      )}
      {!isSubmitting && saveError && (
        <Div role="alert">
          <ResultBanner
            variant="danger"
            title={t("post.widget.saveFailed")}
            message={t("post.widget.saveFailedHint")}
          >
            {saveError.errorType.errorCode < 500 && (
              <P className="text-sm">{saveError.message}</P>
            )}
          </ResultBanner>
        </Div>
      )}

      <Div className="grid min-w-0 grid-cols-1 items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_16rem]">
        <Div className="flex min-w-0 flex-col gap-4">
          <SectionGroup title={t("post.widget.details")}>
            <Div className="grid min-w-0 grid-cols-1 gap-3 @md:grid-cols-2">
              <Div className="flex min-w-0 flex-col items-start gap-2">
                <Span className="text-sm font-medium">
                  {t("companyId.label")}
                </Span>
                {interactive && !disabled ? (
                  <DocumentScopePicker
                    kind="company"
                    value={companyId}
                    appliedLabel={
                      company?.id === companyId ? company?.name : undefined
                    }
                    required
                    onSelect={(id) => companyField.onChange(id)}
                  />
                ) : (
                  <EntityPickerFieldWidget
                    fieldName="companyId"
                    field={field.children.companyId}
                  />
                )}
              </Div>
              <Div className="flex min-w-0 flex-col items-start gap-2">
                <Span className="text-sm font-medium">
                  {t("customerId.label")}
                </Span>
                {interactive && !disabled ? (
                  <DocumentScopePicker
                    kind="customer"
                    value={customerId}
                    appliedLabel={selectedCustomerLabel}
                    required
                    onSelect={(id) => customerField.onChange(id)}
                  />
                ) : (
                  <EntityPickerFieldWidget
                    fieldName="customerId"
                    field={field.children.customerId}
                  />
                )}
                {interactive && !disabled && customerId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      form.setValue("customerId", undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    {t("post.widget.clearCustomer")}
                  </Button>
                )}
              </Div>
              <DateFieldWidget
                fieldName="dueDate"
                utcCalendarDay
                field={{ ...field.children.dueDate, description: undefined }}
              />
              <SelectFieldWidget
                fieldName="currency"
                field={{ ...field.children.currency, description: undefined }}
              />
            </Div>
          </SectionGroup>

          {exemptionNotice && (
            <P className="rounded-md border bg-muted/30 p-3 text-sm">
              {exemptionNotice}
            </P>
          )}
          <DocumentDraftLines
            locale={locale}
            disabled={disabled}
            maxLines={100}
            labels={{
              title: t("post.widget.items"),
              description: t("post.widget.item"),
              quantity: t("post.widget.quantity"),
              unitPrice: t("post.widget.unitPrice"),
              taxRate: t("post.widget.taxRate"),
              total: t("post.widget.lineTotal"),
              add: t("post.widget.addItem"),
              remove: t("post.widget.removeItem"),
              empty: t("post.widget.itemsHint"),
              invalid: t("post.widget.itemError"),
            }}
            rows={lineItems.fields.map((itemField, index) => {
              const line = watchedLines[index] ?? itemField;
              const errors = form.formState.errors.lineItems?.[index];
              const taxControl = (
                <DocumentVatPicker
                  rates={vatRates}
                  value={line.taxRate}
                  label={t("post.widget.taxRate")}
                  manualLabel={t("post.widget.manualTaxRate")}
                  disabled={disabled || Boolean(exemptionNotice)}
                  invalid={Boolean(errors?.taxRate)}
                  onChange={(rate) =>
                    form.setValue(`lineItems.${index}.taxRate`, rate, {
                      shouldDirty: true,
                    })
                  }
                />
              );
              return {
                ...line,
                taxControl,
                id: itemField.id,
                formattedTotal: Number.isFinite(amounts[index]?.lineTotal)
                  ? money(amounts[index]?.lineTotal ?? 0)
                  : "",
                errors: {
                  description: Boolean(errors?.description),
                  quantity: Boolean(errors?.quantity),
                  unitPrice: Boolean(errors?.unitPrice),
                  taxRate: Boolean(errors?.taxRate),
                },
              };
            })}
            onDescription={(index, description) =>
              form.setValue(`lineItems.${index}.description`, description, {
                shouldDirty: true,
              })
            }
            onNumber={(index, key, value) =>
              form.setValue(`lineItems.${index}.${key}`, value, {
                shouldDirty: true,
              })
            }
            onAdd={() =>
              lineItems.append({
                description: "",
                quantity: 1,
                unitPrice: 0,
                taxRate: 0,
              })
            }
            onRemove={(index) => lineItems.remove(index)}
          />

          <SectionGroup title={t("notes.label")}>
            <TextareaFieldWidget
              fieldName="notes"
              field={{
                ...field.children.notes,
                label: undefined,
                description: undefined,
              }}
            />
          </SectionGroup>
        </Div>

        <SectionGroup title={t("post.widget.summary")}>
          <Div className="flex min-w-0 flex-col gap-2 text-sm">
            <Div className="flex justify-between gap-2">
              <Span className="text-muted-foreground">
                {t("post.widget.net")}
              </Span>
              <Span className="text-right tabular-nums">
                {hasIncompleteAmounts
                  ? ""
                  : money((totalCents - vatCents) / 100)}
              </Span>
            </Div>
            <Div className="flex justify-between gap-2">
              <Span className="text-muted-foreground">
                {t("post.widget.tax")}
              </Span>
              <Span className="text-right tabular-nums">
                {hasIncompleteAmounts ? "" : money(vatCents / 100)}
              </Span>
            </Div>
            <Div className="flex justify-between gap-2 border-t pt-2 font-semibold">
              <Span>{t("post.widget.total")}</Span>
              <Span className="text-right tabular-nums">
                {hasIncompleteAmounts ? "" : money(totalCents / 100)}
              </Span>
            </Div>
            {!currency && (
              <P className="text-xs text-muted-foreground">
                {effectiveCurrency
                  ? t("post.widget.companyCurrencyValue", {
                      currency: effectiveCurrency,
                    })
                  : t("post.widget.companyCurrency")}
              </P>
            )}
          </Div>
        </SectionGroup>
      </Div>
    </WidgetShell>
  );
}
