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

import { EstimateStatusDB } from "../../enum";
import type definition from "./definition";

type Row = (typeof definition.GET.types.ResponseOutput)["estimates"][number];

export function EstimateListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const openRelated = useRelatedEntityNavigation();
  const rememberList = useDocumentListHistory("payment-estimate-list");
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
        import("../[estimateId]/get/definition"),
      ]);
      push(createDef.default.POST, {
        renderInModal: false,
        data: data?.selectedCompanyId
          ? { companyId: data.selectedCompanyId }
          : undefined,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            estimateId: responseData.estimate.id,
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
        import("../[estimateId]/get/definition").then(
          (module) => module.default.GET,
        ),
      { urlPathParams: { estimateId: row.id } },
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
      filtered={Boolean(
        statusField.value || searchField.value?.trim() || customerId,
      )}
      activeFilters={Boolean(
        companyId || searchField.value?.trim() || customerId,
      )}
      scopeSummary={data?.selectedCompanyName}
      selecting={Boolean(onPick)}
      statusTabs={
        isInteractive && onSubmit ? (
          <DocumentStatusTabs
            allLabel={t("status.placeholder")}
            selected={statusField.value}
            options={EstimateStatusDB.map((option) => ({
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
        isInteractive && !onPick ? (
          <Button
            type="button"
            size="sm"
            onClick={createDocument}
            className="gap-1.5 whitespace-normal"
          >
            <FilePlus className="h-4 w-4" />
            {t("widget.newEstimate")}
          </Button>
        ) : undefined
      }
      columns={[
        { id: "estimateNumber", label: t("get.response.estimateNumber") },
        { id: "customerName", label: t("get.response.customerName") },
        { id: "createdAt", label: t("get.response.createdAt") },
        { id: "validUntil", label: t("get.response.validUntil") },
        { id: "status", label: t("get.response.status") },
        { id: "total", label: t("get.response.total"), numeric: true },
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
      items={(data?.estimates ?? []).map((row) => {
        const reference = row.estimateNumber;
        const badges = (
          <StatusPill
            status={t(row.status)}
            variant={documentStatusVariant(row.status)}
          />
        );
        const meta = (
          <>
            <Span className="font-semibold">
              {money(row.total, row.currency)}
            </Span>
            {row.companyName && <Span>{row.companyName}</Span>}
            {row.validUntil && (
              <Span>
                {t("widget.valid")} {formatDocDate(row.validUntil, locale)}
              </Span>
            )}
          </>
        );

        const referenceCell = (
          <Span className="font-semibold whitespace-nowrap">{reference}</Span>
        );
        return {
          id: row.id,
          title: reference,
          subtitle: row.customerName ?? undefined,
          badges,
          meta,
          cells: {
            estimateNumber: referenceCell,
            customerName: row.customerName ?? "-",
            createdAt: formatDocDate(row.createdAt, locale),
            validUntil: row.validUntil
              ? formatDocDate(row.validUntil, locale)
              : "-",
            status: badges,
            total: money(row.total, row.currency),
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
          column: "total",
          label: t("get.response.total"),
          values: (data?.estimates ?? []).map((row) => ({
            currency: row.currency,
            amount: row.total,
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
