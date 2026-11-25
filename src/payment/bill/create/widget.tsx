"use client";

import { dateSchema } from "next-vibe/core/definition/common.schema";
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
  formatPercent,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import vendorDefinition from "@/purchasing/vendor/[vendorId]/get/definition";

import { calculateBillLine, summarizeBillLines } from "./amounts";
import { billDateToday, billDueDateFromTerms } from "./dates";
import type definition from "./definition";
import { BillLineEditor } from "./line-editor";

const vendorPickerSchema = z.object({ id: z.uuid(), name: z.string() });

export function BillCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { canGoBack, pop, push } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const disabled = useWidgetDisabled();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const companyId = form.watch("companyId");
  const billDate = useWatch({ control: form.control, name: "billDate" });
  const dueDate = useWatch({ control: form.control, name: "dueDate" });
  const vendorId = useWatch({ control: form.control, name: "vendorId" });
  const supplierName = form.watch("supplierName");
  const currency = form.watch("currency") ?? "EUR";
  const lines = form.watch("lineItems") ?? [];
  const [vendorRejected, setVendorRejected] = useState(false);
  const automaticDueTime = useRef<number | undefined>(undefined);
  const appliedVendorId = useRef<string | undefined>(undefined);
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const readVendor = isInteractive && !data?.id && Boolean(vendorId);
  const vendorOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { vendorId: vendorId ?? "" },
        queryOptions: { enabled: readVendor },
      },
    }),
    [vendorId, readVendor],
  );
  const vendorRead = useEndpoint(
    vendorDefinition,
    vendorOptions,
    logger,
    user,
  ).read;
  const vendor = vendorRead?.data?.result;
  const activeVendor =
    vendor?.isActive && vendor.companyId === companyId && vendor.id === vendorId
      ? vendor
      : undefined;
  const summary = summarizeBillLines(lines.map(calculateBillLine));
  const money = (amount: number): string =>
    formatMoney(amount, currency, locale);

  useEffect(() => {
    if (isInteractive && !data?.id && !billDate) {
      form.setValue("billDate", billDateToday());
    }
  }, [billDate, data?.id, form, isInteractive]);

  useEffect(() => {
    if (vendor && vendor.companyId !== companyId && vendorId === vendor.id) {
      form.setValue("vendorId", undefined, { shouldDirty: true });
      form.setValue("supplierName", undefined, { shouldDirty: true });
      form.setValue("supplierVatNumber", undefined, { shouldDirty: true });
    }
  }, [companyId, form, vendor, vendorId]);

  useEffect(() => {
    if (!activeVendor || appliedVendorId.current === activeVendor.id) {
      return;
    }
    appliedVendorId.current = activeVendor.id;
    form.setValue("supplierName", activeVendor.name, { shouldDirty: true });
    if (!form.getFieldState("supplierVatNumber").isDirty) {
      form.setValue("supplierVatNumber", activeVendor.vatNumber ?? undefined);
    }
    const vendorCurrency = z
      .enum(CurrenciesArr)
      .safeParse(activeVendor.defaultCurrency);
    if (vendorCurrency.success && !form.getFieldState("currency").isDirty) {
      form.setValue("currency", vendorCurrency.data);
    }
  }, [activeVendor, form]);

  const vendorTerms = activeVendor?.defaultPaymentTermsDays;
  const vendorReady = !vendorId || Boolean(activeVendor);
  useEffect(() => {
    if (!isInteractive || data?.id || !vendorReady) {
      return;
    }
    const isManual = form.getFieldState("dueDate").isDirty;
    if (isManual && dueDate === undefined) {
      automaticDueTime.current = undefined;
      form.setValue("dueDate", null, { shouldDirty: true });
      return;
    }
    if (
      isManual ||
      dueDate === null ||
      (dueDate && new Date(dueDate).getTime() !== automaticDueTime.current)
    ) {
      return;
    }

    const suggested = billDueDateFromTerms(billDate, vendorTerms);
    if (suggested && suggested.getTime() !== automaticDueTime.current) {
      automaticDueTime.current = suggested.getTime();
      form.resetField("dueDate", { defaultValue: suggested });
    } else if (!suggested && automaticDueTime.current !== undefined) {
      automaticDueTime.current = undefined;
      form.setValue("dueDate", undefined);
    }
  }, [
    billDate,
    data?.id,
    dueDate,
    form,
    isInteractive,
    vendorReady,
    vendorTerms,
  ]);

  const pickVendor = (): void => {
    if (!companyId) {
      return;
    }
    void (async (): Promise<void> => {
      const { default: vendorList } =
        await import("@/purchasing/vendor/list/definition");
      push(vendorList.GET, {
        data: { companyId },
        renderInModal: true,
        pickerLabelField: "name",
        pickerCallback: (selected) => {
          const parsed = vendorPickerSchema.safeParse(selected);
          if (!parsed.success) {
            setVendorRejected(true);
            return;
          }
          setVendorRejected(false);
          appliedVendorId.current = undefined;
          form.setValue("vendorId", parsed.data.id, { shouldDirty: true });
          form.setValue("supplierName", parsed.data.name, {
            shouldDirty: true,
          });
          form.resetField("supplierVatNumber");
        },
      });
    })();
  };

  const applyTerms = (): void => {
    const suggested = billDueDateFromTerms(billDate, vendorTerms);
    if (suggested) {
      automaticDueTime.current = suggested.getTime();
      form.resetField("dueDate", { defaultValue: suggested });
    }
  };

  const manualVendor = (): void => {
    form.setValue("vendorId", undefined, { shouldDirty: true });
    form.setValue("supplierName", undefined, { shouldDirty: true });
    form.setValue("supplierVatNumber", undefined, { shouldDirty: true });
    setVendorRejected(false);
  };

  const viewBill = (billId: string): void => {
    void (async (): Promise<void> => {
      const { default: getDefinition } =
        await import("../[billId]/get/definition");
      push(getDefinition.GET, { urlPathParams: { billId } });
    })();
  };
  const addAnother = (selectedCompanyId: string): void => {
    void (async (): Promise<void> => {
      const { default: createDefinition } = await import("./definition");
      push(createDefinition.POST, { data: { companyId: selectedCompanyId } });
    })();
  };

  if (data?.id) {
    return (
      <WidgetShell layout="page">
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={`${data.supplierNameResponse} · ${formatMoney(data.total, data.currencyResponse ?? currency, locale)}`}
        >
          {isInteractive && (
            <>
              <Button type="button" size="sm" onClick={() => viewBill(data.id)}>
                {t("post.widget.viewButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addAnother(data.companyIdResponse)}
              >
                {t("post.widget.addAnotherButton")}
              </Button>
            </>
          )}
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
            field={{ text: "post.widget.submit" }}
          />
        }
      />
      <FormAlertWidget field={{}} />
      <Div className="grid min-w-0 grid-cols-1 items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_16rem]">
        <Div className="flex min-w-0 flex-col gap-4">
          <SectionGroup title={t("post.widget.supplier")}>
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={field.children.companyId}
            />
            <Div className="flex min-w-0 flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || !companyId}
                onClick={pickVendor}
              >
                {(vendorId && supplierName) || t("post.widget.chooseVendor")}
              </Button>
              {vendorId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={manualVendor}
                >
                  {t("post.widget.manualVendor")}
                </Button>
              )}
              {!companyId && (
                <P className="text-sm text-muted-foreground">
                  {t("post.widget.selectCompanyFirst")}
                </P>
              )}
            </Div>
            {(vendorRejected ||
              vendorRead?.isError ||
              (vendor && !activeVendor)) && (
              <P className="text-sm text-destructive">
                {t("post.errors.vendor")}
              </P>
            )}
            <Div className="grid min-w-0 grid-cols-1 gap-3 @md:grid-cols-2">
              <TextFieldWidget
                fieldName="supplierName"
                field={{
                  ...field.children.supplierName,
                  description: undefined,
                  readonly: Boolean(vendorId),
                }}
              />
              <TextFieldWidget
                fieldName="supplierVatNumber"
                field={{
                  ...field.children.supplierVatNumber,
                  description: undefined,
                }}
              />
            </Div>
          </SectionGroup>

          <SectionGroup title={t("post.widget.dates")}>
            <Div className="grid min-w-0 grid-cols-1 gap-3 @md:grid-cols-2">
              <TextFieldWidget
                fieldName="billNumber"
                field={{ ...field.children.billNumber, description: undefined }}
              />
              <SelectFieldWidget
                fieldName="currency"
                field={{ ...field.children.currency, description: undefined }}
              />
              <DateFieldWidget
                fieldName="billDate"
                utcCalendarDay
                field={{ ...field.children.billDate, description: undefined }}
              />
              <Div className="flex min-w-0 flex-col gap-1">
                <DateFieldWidget
                  fieldName="dueDate"
                  utcCalendarDay
                  field={{
                    ...field.children.dueDate,
                    description: undefined,
                    schema: dateSchema.optional(),
                  }}
                />
                {activeVendor &&
                  activeVendor.defaultPaymentTermsDays !== null && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="self-start"
                      disabled={disabled || !billDate}
                      onClick={applyTerms}
                    >
                      {t("post.widget.terms")}
                    </Button>
                  )}
              </Div>
            </Div>
          </SectionGroup>

          <BillLineEditor money={money} />

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
          {summary.valid ? (
            <Div className="flex min-w-0 flex-col gap-2 text-sm">
              <Div className="flex justify-between gap-2">
                <Span className="text-muted-foreground">
                  {t("post.widget.net")}
                </Span>
                <Span className="tabular-nums">{money(summary.subtotal)}</Span>
              </Div>
              {[...summary.taxByRate]
                .toSorted(([left], [right]) => left - right)
                .map(([rate, amount]) => (
                  <Div key={rate} className="flex justify-between gap-2">
                    <Span className="text-muted-foreground">
                      {t("post.widget.tax")} {formatPercent(rate, locale)}
                    </Span>
                    <Span className="tabular-nums">{money(amount)}</Span>
                  </Div>
                ))}
              <Div className="flex justify-between gap-2 border-t pt-2 font-semibold">
                <Span>{t("post.widget.total")}</Span>
                <Span className="tabular-nums">{money(summary.total)}</Span>
              </Div>
            </Div>
          ) : (
            <P className="text-sm text-destructive">
              {t("post.errors.amounts")}
            </P>
          )}
        </SectionGroup>
      </Div>
    </WidgetShell>
  );
}
