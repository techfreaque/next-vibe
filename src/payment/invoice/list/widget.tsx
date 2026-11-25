"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useController } from "react-hook-form";

import {
  useDocumentListCopy,
  useDocumentListHistory,
} from "@/finance/document-list-hooks";
import {
  DocumentList,
  DocumentPageSize,
  DocumentScopePicker,
  DocumentSearch,
  DocumentStatusTabs,
} from "@/finance/document-list-ui";
import { documentStatusVariant } from "@/finance/document-status";

import { InvoiceStatus, InvoiceStatusDB } from "../../enum";
import type definition from "./definition";
import { OVERDUE_INVOICE_FILTER } from "./filters";

type Row = (typeof definition.GET.types.ResponseOutput)["invoices"][number];

export function InvoiceListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const openRelated = useRelatedEntityNavigation();
  const rememberList = useDocumentListHistory("payment-invoice-list");
  const t = useWidgetTranslation<typeof definition.GET>();
  const tDocument = useDocumentListCopy();
  const locale = useWidgetLocale();
  const onPick = usePickerCallback<Row>();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const companyId = form.watch("companyId");
  const { field: searchField } = useController({
    control: form.control,
    name: "search",
  });
  const { field: statusField } = useController({
    control: form.control,
    name: "status",
  });
  const customerId = form.watch("customerId");
  const money = (amount: number | string, currency: string): string =>
    formatMoney(amount, currency, locale);

  const rememberFilters = (page: number): void => {
    const values = form.getValues();
    rememberList({
      search: values.search,
      status: values.status,
      companyId: values.companyId,
      customerId: values.customerId,
      page,
      pageSize: values.pageSize,
    });
  };

  const setPage = (page: number): void => {
    form.setValue("page", page, { shouldDirty: true });
    rememberFilters(page);
  };

  const clearFilters = (): void => {
    form.reset({ page: 1, pageSize: data?.pageSizeApplied ?? 20 });
    setPage(1);
  };

  const createDocument = (): void => {
    rememberFilters(data?.currentPage ?? 1);
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[invoiceId]/get/definition"),
      ]);
      push(createDef.default.POST, {
        renderInModal: false,
        data: data?.selectedCompanyId
          ? { companyId: data.selectedCompanyId }
          : undefined,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoice.id,
          }),
        },
      });
    })();
  };

  const openDocument = (row: Row): void => {
    if (onPick) {
      onPick(row);
      return;
    }
    rememberFilters(data?.currentPage ?? 1);
    openRelated(
      () =>
        import("../[invoiceId]/get/definition").then(
          (module) => module.default.GET,
        ),
      { urlPathParams: { invoiceId: row.id } },
    );
  };

  return (
    <DocumentList
      title={t("widget.title")}
      backLabel={t("widget.back")}
      loadingLabel={t("widget.loading")}
      emptyTitle={t("widget.empty.title")}
      emptyHint={onPick ? undefined : t("widget.empty.hint")}
      filterLabel={t("widget.filters")}
      filtered={data?.hasFilters ?? false}
      statusTabs={
        isInteractive && onSubmit ? (
          <DocumentStatusTabs
            allLabel={t("status.placeholder")}
            selected={statusField.value}
            options={[
              { status: OVERDUE_INVOICE_FILTER, label: t("widget.overdue") },
              ...InvoiceStatusDB.map((option) => ({
                status: option,
                label: t(option),
              })),
            ]}
            onSelect={(value) => {
              statusField.onChange(value);
              setPage(1);
            }}
          />
        ) : undefined
      }
      filters={
        isInteractive && onSubmit ? (
          <>
            <DocumentSearch
              value={searchField.value}
              label={t("search.label")}
              placeholder={t("search.placeholder")}
              onChange={(value) => {
                searchField.onChange(value || undefined);
                setPage(1);
              }}
            />
            <Div className="flex min-w-0 flex-wrap items-center gap-2">
              <DocumentScopePicker
                kind="company"
                value={companyId ?? data?.selectedCompanyId ?? undefined}
                appliedLabel={data?.selectedCompanyName}
                onSelect={(id) => {
                  form.setValue("companyId", id, { shouldDirty: true });
                  setPage(1);
                }}
                onClear={
                  companyId
                    ? () => {
                        form.setValue("companyId", undefined, {
                          shouldDirty: true,
                        });
                        setPage(1);
                      }
                    : undefined
                }
              />
              <DocumentScopePicker
                kind="customer"
                value={customerId}
                onSelect={(id) => {
                  form.setValue("customerId", id, { shouldDirty: true });
                  setPage(1);
                }}
                onClear={
                  customerId
                    ? () => {
                        form.setValue("customerId", undefined, {
                          shouldDirty: true,
                        });
                        setPage(1);
                      }
                    : undefined
                }
              />
            </Div>
          </>
        ) : undefined
      }
      create={
        isInteractive && !onPick && data?.canCreateInvoice === true ? (
          <Button
            type="button"
            size="sm"
            onClick={createDocument}
            className="gap-1.5 whitespace-normal"
          >
            <FilePlus className="h-4 w-4" />
            {t("widget.newInvoice")}
          </Button>
        ) : undefined
      }
      columns={[
        {
          id: "invoiceSequenceNumber",
          label: t("get.response.invoiceSequenceNumber"),
        },
        { id: "customerName", label: t("get.response.customerName") },
        { id: "createdAt", label: t("get.response.createdAt") },
        { id: "dueDate", label: t("get.response.dueDate") },
        { id: "status", label: t("get.response.status") },
        { id: "amount", label: t("get.response.amount"), numeric: true },
        { id: "amountDue", label: t("get.response.amountDue"), numeric: true },
      ]}
      pageSize={
        isInteractive && onSubmit ? (
          <DocumentPageSize
            label={t("pageSize.label")}
            value={data?.pageSizeApplied ?? 20}
            onChange={(value) => {
              form.setValue("pageSize", value, { shouldDirty: true });
              setPage(1);
            }}
          />
        ) : undefined
      }
      items={(data?.invoices ?? []).map((row) => {
        const reference =
          row.invoiceNumber ??
          (row.invoiceSequenceNumber === null
            ? tDocument("documents.noReference")
            : `INV-${row.invoiceSequenceNumber}`);
        const partialPayment = row.amountPaid > 0 && row.amountDue > 0;
        const badges = (
          <StatusPill
            status={
              row.isOverdue
                ? t("widget.overdue")
                : partialPayment
                  ? t("widget.partlyPaid")
                  : t(row.status)
            }
            variant={documentStatusVariant(row.status, {
              overdue: row.isOverdue,
              partialPayment,
            })}
          />
        );
        const meta = (
          <>
            <Span className="font-semibold tabular-nums">
              {money(
                row.status === InvoiceStatus.OPEN ? row.amountDue : row.amount,
                row.currency,
              )}
            </Span>
            {row.dueDate && (
              <Span>
                {t("widget.due")} {formatDocDate(row.dueDate, locale)}
              </Span>
            )}
          </>
        );

        const referenceCell = (
          <Span className="font-semibold whitespace-nowrap">{reference}</Span>
        );
        const dueDateCell = row.dueDate ? (
          <Span
            className={
              row.isOverdue
                ? "text-destructive whitespace-nowrap"
                : "whitespace-nowrap"
            }
          >
            {formatDocDate(row.dueDate, locale)}
          </Span>
        ) : (
          "-"
        );
        const amountDueCell = (
          <Span
            className={
              row.amountDue > 0 ? "font-semibold" : "text-muted-foreground"
            }
          >
            {money(row.amountDue, row.currency)}
          </Span>
        );
        return {
          id: row.id,
          title: row.customerName ?? reference,
          subtitle: row.customerName
            ? reference
            : (row.companyName ?? undefined),
          badges,
          meta,
          cells: {
            invoiceSequenceNumber: referenceCell,
            customerName: row.customerName ?? "-",
            createdAt: formatDocDate(row.createdAt, locale),
            dueDate: dueDateCell,
            status: badges,
            amount: money(row.amount, row.currency),
            amountDue: amountDueCell,
          },
          action: isInteractive
            ? {
                label: tDocument(
                  onPick ? "documents.select" : "documents.open",
                  { reference },
                ),
                onClick: () => openDocument(row),
              }
            : undefined,
        };
      })}
      pageAmounts={[
        {
          column: "amount",
          label: t("get.response.amount"),
          values: (data?.invoices ?? []).map((row) => ({
            currency: row.currency,
            amount: row.amount,
          })),
        },
        {
          column: "amountDue",
          label: t("get.response.amountDue"),
          values: (data?.invoices ?? []).map((row) => ({
            currency: row.currency,
            amount: row.amountDue,
          })),
        },
      ]}
      pagination={
        data
          ? {
              total: data.total,
              currentPage: data.currentPage,
              pageCount: data.pageCount,
            }
          : undefined
      }
      onClear={clearFilters}
      onPage={setPage}
    />
  );
}
