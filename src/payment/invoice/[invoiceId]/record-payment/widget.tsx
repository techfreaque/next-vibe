"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { utcDayFromPickerDate } from "next-vibe/unified-ui/widgets/form-fields/date-field/calendar-date";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { InvoiceStatus } from "@/payment/enum";

import invoiceListDefinition from "../../list/definition";
import invoiceDefinition from "../get/definition";
import type definition from "./definition";

export function InvoiceRecordPaymentWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();

  const disabled = useWidgetDisabled();
  const interactive = useWidgetIsInteractive();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const invoiceId = form.watch("invoiceId");
  const shouldLoadInvoice = interactive && !data?.success;
  const validInvoiceId = z.uuid().safeParse(invoiceId).success;
  const invoiceOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { invoiceId },
        queryOptions: {
          enabled: shouldLoadInvoice && validInvoiceId,
        },
      },
    }),
    [shouldLoadInvoice, validInvoiceId, invoiceId],
  );
  const invoiceRead = useEndpoint(
    invoiceDefinition,
    invoiceOptions,
    logger,
    user,
  ).read;
  const loadedInvoice = invoiceRead?.data;
  const invoice = loadedInvoice?.id === invoiceId ? loadedInvoice : undefined;
  const readFailure =
    invoiceRead?.response?.success === false ? invoiceRead.response : undefined;
  const status = readFailure?.errorType.errorCode;
  const formVisible =
    shouldLoadInvoice &&
    !readFailure &&
    invoice?.canManage === true &&
    invoice.status === InvoiceStatus.OPEN;
  const companyId = invoice?.companyId ?? undefined;
  const currency = invoice?.currency;
  const amountDue =
    invoice && currency && Number(invoice.amountDue) > 0
      ? Number(invoice.amountDue)
      : undefined;
  const reference = [
    invoice?.invoiceNumber ?? invoice?.invoiceSequenceNumber,
    invoice?.customerName ?? invoice?.companyName,
    amountDue !== undefined && currency
      ? t("widget.amountDue", {
          amount: formatMoney(amountDue, currency, locale),
        })
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
  const accounts = useApiQuery({
    endpoint: accountsDefinition.GET,
    requestData: {
      companyId,
      postableOnly: true,
      subtypes: [AccountSubtype.BANK, AccountSubtype.CASH],
      page: 1,
      pageSize: 200,
    },
    options: {
      enabled: formVisible && z.uuid().safeParse(companyId).success,
      queryKey: `invoice-payment-accounts:${companyId ?? ""}`,
    },
    logger,
    user,
  }).data?.accounts;
  const paymentAccounts =
    accounts?.filter(
      (account) =>
        account.companyId === companyId &&
        account.isActive &&
        account.isPostable &&
        (account.subtype === AccountSubtype.BANK ||
          account.subtype === AccountSubtype.CASH),
    ) ?? [];

  const receiptKey = form.watch("receiptKey");
  const generatedReceiptKey = useRef<string | undefined>(undefined);
  const didInitializeDate = useRef(false);

  useEffect(() => {
    if (formVisible && !didInitializeDate.current) {
      didInitializeDate.current = true;
      if (form.getValues("paidAt") === undefined) {
        form.setValue("paidAt", utcDayFromPickerDate(new Date()));
      }
    }
  }, [form, formVisible]);

  // The number field can initialize to zero. Seed the balance only while
  // the operator has left the amount untouched.
  const prefilledInvoice = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      !formVisible ||
      amountDue === undefined ||
      prefilledInvoice.current === invoiceId
    ) {
      return;
    }
    prefilledInvoice.current = invoiceId;
    if (
      !form.getFieldState("amount").isDirty &&
      !(form.getValues("amount") > 0)
    ) {
      form.setValue("amount", amountDue);
    }
  }, [amountDue, form, formVisible, invoiceId]);

  useEffect(() => {
    if (!receiptKey && formVisible) {
      generatedReceiptKey.current ??= uuidv4();
      form.setValue("receiptKey", generatedReceiptKey.current);
    }
  }, [formVisible, form, receiptKey]);

  const handleViewInvoice = (): void => {
    if (invoiceId) {
      navigation.push(invoiceDefinition.GET, { urlPathParams: { invoiceId } });
    } else {
      navigation.push(invoiceListDefinition.GET);
    }
  };

  const handleBack = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      handleViewInvoice();
    }
  };

  if (data?.success === true) {
    return (
      <ResultBanner
        variant="success"
        title={t("post.success.title")}
        message={t("widget.paymentRecorded")}
      >
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleViewInvoice}
          >
            {t("widget.viewInvoice")}
          </Button>
          {navigation.canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigation.pop()}
            >
              {t("widget.back")}
            </Button>
          )}
        </Div>
      </ResultBanner>
    );
  }

  if (!formVisible) {
    const missing = !validInvoiceId || status === 404;
    const denied = status === 403 || invoice?.canManage === false;
    const unavailable = !missing && !denied && status !== undefined;
    const closed =
      invoice?.canManage === true && invoice.status !== InvoiceStatus.OPEN;
    const error = missing ? "notFound" : denied ? "forbidden" : "server";
    return (
      <AdminForm
        title={t("post.title")}
        primaryAction={null}
        className="mx-auto max-w-3xl"
      >
        {closed && !readFailure ? (
          <ResultBanner
            variant="warning"
            title={t("widget.notOpenTitle")}
            message={t("widget.notOpenMessage")}
          >
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleViewInvoice}
            >
              {t("widget.viewInvoice")}
            </Button>
          </ResultBanner>
        ) : missing || denied || unavailable ? (
          <ResultBanner
            variant="danger"
            title={t(`post.errors.${error}.title`)}
            message={t(`post.errors.${error}.description`)}
          >
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigation.push(invoiceListDefinition.GET)}
              >
                {t("widget.backToInvoices")}
              </Button>
              {status !== undefined && canRetryRecordRead(status) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void invoiceRead?.refetch()}
                >
                  {t("widget.retryInvoice")}
                </Button>
              )}
            </Div>
          </ResultBanner>
        ) : (
          <LoadingBlock message={t("widget.loadingInvoice")} />
        )}
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("post.title")}
      description={reference || undefined}
      className="mx-auto max-w-3xl"
      backButton={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.submit" }}
        />
      }
    >
      <AdminFormSection title={t("widget.details")} columns={2}>
        <NumberFieldWidget
          fieldName="amount"
          presentation="money"
          currency={currency}
          field={{
            ...withValue(field.children.amount, undefined, null),
            className: "[&_input]:h-10",
          }}
        />
        <SelectFieldWidget
          fieldName="method"
          field={withValue(field.children.method, undefined, null)}
        />
        <DateFieldWidget
          fieldName="paidAt"
          utcCalendarDay
          localizedDate
          field={withValue(field.children.paidAt, undefined, null)}
        />
        {companyId && (
          <FormField
            control={form.control}
            name="accountNodeId"
            render={({ field: accountField, fieldState }) => (
              <FormItem className="flex min-w-0 flex-col gap-2">
                <FormLabel>{t("accountNodeId.label")}</FormLabel>
                <Select
                  name={accountField.name}
                  value={accountField.value ?? "automatic"}
                  onValueChange={(value) =>
                    accountField.onChange(
                      value === "automatic" ? undefined : value,
                    )
                  }
                  disabled={disabled || !paymentAccounts.length}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue
                        placeholder={t("accountNodeId.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="automatic">
                      {t("accountNodeId.automatic")}
                    </SelectItem>
                    {paymentAccounts.map(({ id, code, name }) => (
                      <SelectItem key={id} value={id}>
                        {code} {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <FormMessage t={t} />}
              </FormItem>
            )}
          />
        )}
      </AdminFormSection>
    </AdminForm>
  );
}
