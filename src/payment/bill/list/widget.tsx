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

import { BillStatusDB } from "../../enum";
import type definition from "./definition";

type Row = (typeof definition.GET.types.ResponseOutput)["bills"][number];

export function BillListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const openRelated = useRelatedEntityNavigation();
  const rememberList = useDocumentListHistory("payment-bill-list");
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
  const money = (amount: number | string, currency: string): string =>
    formatMoney(amount, currency, locale);

  const rememberFilters = (page: number): void => {
    const values = form.getValues();
    rememberList({
      search: values.search,
      status: values.status,
      companyId: values.companyId,
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
        import("../[billId]/get/definition"),
      ]);
      push(createDef.default.POST, {
        renderInModal: false,
        data: data?.selectedCompanyId
          ? { companyId: data.selectedCompanyId }
          : undefined,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({ billId: responseData.id }),
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
        import("../[billId]/get/definition").then(
          (module) => module.default.GET,
        ),
      {
        urlPathParams: { billId: row.id },
      },
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
            options={BillStatusDB.map((option) => ({
              status: option,
              label: t(option),
            }))}
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
            </Div>
          </>
        ) : undefined
      }
      create={
        isInteractive && !onPick ? (
          <Button
            type="button"
            size="sm"
            onClick={createDocument}
            className="gap-1.5 whitespace-normal"
          >
            <FilePlus className="h-4 w-4" />
            {t("widget.newBill")}
          </Button>
        ) : undefined
      }
      columns={[
        { id: "billNumber", label: t("get.response.billNumber") },
        { id: "supplierName", label: t("get.response.supplierName") },
        { id: "billDate", label: t("get.response.billDate") },
        { id: "dueDate", label: t("get.response.dueDate") },
        { id: "status", label: t("get.response.status") },
        { id: "billTotal", label: t("get.response.billTotal"), numeric: true },
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
      items={(data?.bills ?? []).map((row) => {
        const reference = row.billNumber ?? tDocument("documents.noReference");
        const badges = (
          <StatusPill
            status={t(row.status)}
            variant={documentStatusVariant(row.status, {
              overdue: row.isOverdue,
            })}
          />
        );
        const meta = (
          <>
            <Span className="font-semibold">
              {money(row.billTotal, row.currency)}
            </Span>
            {row.companyName && <Span>{row.companyName}</Span>}
            {row.dueDate && (
              <Span>
                {t("widget.due")} {formatDocDate(row.dueDate, locale)}
              </Span>
            )}
            {row.isOverdue && (
              <Span className="text-destructive">{t("widget.overdue")}</Span>
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
        return {
          id: row.id,
          title: reference,
          subtitle: row.supplierName,
          badges,
          meta,
          cells: {
            billNumber: referenceCell,
            supplierName: row.supplierName,
            billDate: formatDocDate(row.billDate, locale),
            dueDate: dueDateCell,
            status: badges,
            billTotal: money(row.billTotal, row.currency),
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
          column: "billTotal",
          label: t("get.response.billTotal"),
          values: (data?.bills ?? []).map((row) => ({
            currency: row.currency,
            amount: row.billTotal,
          })),
        },
      ]}
      pagination={
        data
          ? {
              total: data.totalCount,
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
