"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
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
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import type { JSX } from "react";

import {
  DocumentList,
  DocumentScopePicker,
  useDocumentListCopy,
  useDocumentListHistory,
} from "@/finance/document-list-ui";

import { EstimateStatus } from "../../enum";
import type definition from "./definition";

type Row = (typeof definition.GET.types.ResponseOutput)["estimates"][number];

const statusVariants: Record<Row["status"], StatusPillVariant> = {
  [EstimateStatus.DRAFT]: "muted",
  [EstimateStatus.SENT]: "info",
  [EstimateStatus.ACCEPTED]: "success",
  [EstimateStatus.DECLINED]: "danger",
  [EstimateStatus.EXPIRED]: "muted",
  [EstimateStatus.CONVERTED]: "success",
};

export function EstimateListWidget({
  field: { children },
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
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
  const customerId = form.watch("customerId");
  const money = (amount: number, currency: string): string =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "code",
    }).format(amount);

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

  const submitPage = (page: number): void => {
    setPage(page);
    onSubmit?.();
  };

  const clearFilters = (): void => {
    form.reset({ page: 1, pageSize: data?.pageSizeApplied ?? 20 });
    submitPage(1);
  };

  const createDocument = (): void => {
    rememberFilters(data?.currentPage ?? 1);
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[estimateId]/get/definition"),
      ]);
      push(createDef.default.POST, {
        renderInModal: true,
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
      filtered={data?.hasFilters ?? false}
      filters={
        isInteractive && onSubmit ? (
          <>
            <TextFieldWidget fieldName="search" field={children.search} />
            <Div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2">
              <SelectFieldWidget fieldName="status" field={children.status} />
              <NumberFieldWidget
                fieldName="pageSize"
                field={children.pageSize}
              />
            </Div>
            <Div className="flex min-w-0 flex-wrap items-center gap-2">
              <DocumentScopePicker
                kind="company"
                value={companyId}
                appliedLabel={
                  data?.selectedCompanyId === companyId
                    ? data?.selectedCompanyName
                    : undefined
                }
                onSelect={(id) =>
                  form.setValue("companyId", id, { shouldDirty: true })
                }
              />
              <DocumentScopePicker
                kind="customer"
                value={customerId}
                onSelect={(id) =>
                  form.setValue("customerId", id, { shouldDirty: true })
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
      items={(data?.estimates ?? []).map((row) => {
        const reference = row.estimateNumber;
        const badges = (
          <StatusPill
            status={t(row.status)}
            variant={statusVariants[row.status]}
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
                {t("widget.valid")} {formatDate(row.validUntil, locale, "PP")}
              </Span>
            )}
          </>
        );
        return {
          id: row.id,
          title: reference,
          subtitle: row.customerName ?? undefined,
          badges,
          meta,
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
      pagination={
        data
          ? {
              total: data.total,
              currentPage: data.currentPage,
              pageCount: data.pageCount,
            }
          : undefined
      }
      onApply={() => submitPage(1)}
      onClear={clearFilters}
      onPage={submitPage}
    />
  );
}
