"use client";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { X } from "next-vibe/ui/components/icons/X";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import {
  RecordTable,
  type RecordTableProps,
} from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { type RelatedEntityItem } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, type ReactNode, useId, useState } from "react";
import { z } from "zod";

import { useToolCompanyId } from "@/companies/_shared/workspace-company-context";

import { useDocumentListCopy } from "./document-list-hooks";

const pickSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  privateName: z.string().optional(),
});

export function DocumentScopePicker({
  id,
  kind,
  value,
  appliedLabel,
  required = false,
  onSelect,
  onClear,
}: {
  id?: string;
  kind: "company" | "customer";
  value?: string;
  appliedLabel?: string | null;
  required?: boolean;
  onSelect: (id: string) => void;
  onClear?: () => void;
}): JSX.Element | null {
  const { push } = useWidgetNavigation();
  const toolCompanyId = useToolCompanyId();
  const t = useDocumentListCopy();
  const [selection, setSelection] = useState<z.infer<typeof pickSchema>>();
  const isCompany = kind === "company";
  const label = t(
    isCompany ? "documents.chooseCompany" : "documents.chooseCustomer",
  );
  const selectedName =
    selection && selection.id === value
      ? (selection.name ?? selection.privateName)
      : appliedLabel;
  const openPicker = (): void => {
    void (async (): Promise<void> => {
      const endpoint = isCompany
        ? (await import("@/companies/list/definition")).default.GET
        : (await import("@/users/list/definition")).default.GET;
      push(endpoint, {
        renderInModal: true,
        pickerLabelField: isCompany ? "name" : "privateName",
        pickerCallback: (selectionData) => {
          const picked = pickSchema.safeParse(selectionData);
          if (picked.success) {
            setSelection(picked.data);
            onSelect(picked.data.id);
          }
        },
      });
    })();
  };
  if (isCompany && toolCompanyId) {
    return null;
  }
  return (
    <Div className="flex min-w-0 items-center">
      <Button
        id={id}
        type="button"
        variant="outline"
        size="sm"
        aria-label={label}
        title={label}
        className="h-auto min-h-9 max-w-full whitespace-normal text-start"
        onClick={openPicker}
      >
        <Span className="max-w-full [overflow-wrap:anywhere]">
          {selectedName ??
            (value || required
              ? label
              : t(
                  isCompany
                    ? "documents.allCompanies"
                    : "documents.allCustomers",
                ))}
        </Span>
      </Button>
      {value && onClear && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t(
            isCompany ? "documents.clearCompany" : "documents.clearCustomer",
          )}
          onClick={() => {
            setSelection(undefined);
            onClear();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Div>
  );
}

export function DocumentPageSize({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}): JSX.Element {
  const id = useId();
  const pageSizes = [...new Set([10, 20, 50, 100, value])].toSorted(
    (a, b) => a - b,
  );
  return (
    <Div className="flex flex-wrap items-center gap-2">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      <Select
        value={String(value)}
        onValueChange={(size) => onChange(Number(size))}
      >
        <SelectTrigger id={id} className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizes.map((size) => (
            <SelectItem value={String(size)} key={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Div>
  );
}

export function DocumentSearch({
  value,
  label,
  placeholder,
  onChange,
}: {
  value?: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <Input
      type="text"
      aria-label={label}
      placeholder={placeholder}
      value={value ?? ""}
      onChangeText={onChange}
    />
  );
}

export function DocumentStatusTabs<Status extends string>({
  allLabel,
  selected,
  options,
  onSelect,
}: {
  allLabel: string;
  selected?: Status;
  options: readonly { status: Status; label: string }[];
  onSelect: (status: Status | undefined) => void;
}): JSX.Element {
  const t = useDocumentListCopy();
  const statusId = useId();
  const all = "__all_document_statuses";
  return (
    <>
      <Div className="flex min-w-0 flex-col gap-1.5 @md:hidden">
        <Label htmlFor={statusId}>{t("documents.status")}</Label>
        <Select
          value={selected ?? all}
          onValueChange={(value) => {
            onSelect(options.find(({ status }) => status === value)?.status);
          }}
        >
          <SelectTrigger
            id={statusId}
            className={selected ? "border-primary" : undefined}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={all}>{allLabel}</SelectItem>
            {options.map(({ status, label }) => (
              <SelectItem key={status} value={status}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>
      <Div className="hidden min-w-0 flex-wrap gap-1 @md:flex">
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          variant={selected === undefined ? "secondary" : "ghost"}
          aria-pressed={selected === undefined}
          onClick={() => onSelect(undefined)}
        >
          {allLabel}
        </Button>
        {options.map(({ status, label }) => (
          <Button
            key={status}
            type="button"
            size="sm"
            className="shrink-0"
            variant={selected === status ? "secondary" : "ghost"}
            aria-pressed={selected === status}
            onClick={() => onSelect(status)}
          >
            {label}
          </Button>
        ))}
      </Div>
    </>
  );
}

interface DocumentPageAmounts {
  column: string;
  label: string;
  values: readonly { currency: string; amount: number | string }[];
}

function groupPageAmounts(columns: readonly DocumentPageAmounts[]): {
  currency: string;
  count: number;
  units: Map<string, bigint>;
}[] {
  const rows = new Map<
    string,
    { currency: string; count: number; units: Map<string, bigint> }
  >();
  for (const { column, values } of columns) {
    const counts = new Map<string, number>();
    for (const { currency, amount } of values) {
      const row = rows.get(currency) ?? {
        currency,
        count: 0,
        units: new Map<string, bigint>(),
      };
      const amountUnits = Math.round(Number(amount) * 10_000);
      if (Number.isSafeInteger(amountUnits)) {
        row.units.set(
          column,
          (row.units.get(column) ?? BigInt(0)) + BigInt(amountUnits),
        );
      }
      const count = (counts.get(currency) ?? 0) + 1;
      counts.set(currency, count);
      row.count = Math.max(row.count, count);
      rows.set(currency, row);
    }
  }
  return [...rows.values()].toSorted((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}

export function DocumentList({
  title,
  backLabel,
  loadingLabel,
  emptyTitle,
  emptyHint,
  filters,
  filterLabel,
  filtered,
  activeFilters,
  scopeSummary,
  selecting,
  columns,
  items,
  pageSize,
  pagination,
  onPage,
  onClear,
  create,
  statusTabs,
  pageAmounts,
}: {
  title: string;
  backLabel: string;
  loadingLabel: string;
  emptyTitle: string;
  emptyHint?: string;
  filters?: ReactNode;
  filterLabel: string;
  filtered: boolean;
  activeFilters?: boolean;
  scopeSummary?: string | null;
  selecting?: boolean;
  columns: RecordTableProps["columns"];
  items: (RelatedEntityItem & { cells: Readonly<Record<string, ReactNode>> })[];
  pageSize?: ReactNode;
  pagination?: { total: number; currentPage: number; pageCount: number };
  onPage: (page: number) => void;
  onClear: () => void;
  create?: ReactNode;
  statusTabs?: ReactNode;
  pageAmounts?: readonly DocumentPageAmounts[];
}): JSX.Element {
  const t = useDocumentListCopy();
  const locale = useWidgetLocale();
  const pageTotals = groupPageAmounts(pageAmounts ?? []).map(
    ({ currency, count, units }) => ({
      currency,
      title: t("documents.pageTotals", { currency }),
      count: t("documents.pageDocumentCount", { count }),
      amounts: (pageAmounts ?? []).map(({ column, label }) => {
        const amount = units.get(column);
        return {
          column,
          label,
          text:
            amount === undefined
              ? ""
              : formatMoney(Number(amount) / 10_000, currency, locale),
        };
      }),
    }),
  );
  const footerRows = pageTotals.map((row) => {
    const cells: Record<string, ReactNode> = {};
    if (columns[0]) {
      cells[columns[0].id] = (
        <Div className="flex flex-col gap-0.5">
          <Span className="font-semibold">{row.title}</Span>
          <Span className="text-xs font-normal text-muted-foreground">
            {row.count}
          </Span>
        </Div>
      );
    }
    for (const amount of row.amounts) {
      cells[amount.column] = amount.text;
    }
    return { id: row.currency, cells };
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const response = useWidgetResponse();
  const { canGoBack, pop } = useWidgetNavigation();
  const isInteractive = useWidgetIsInteractive();
  const read = useWidgetEndpointMutations()?.read;
  const isFetching = read?.isFetching ?? false;
  const hasError = response?.success === false;
  const scopeDenied =
    hasError &&
    response.errorType.errorKey === ErrorResponseTypes.FORBIDDEN.errorKey;
  const showActions = isInteractive && items.some((item) => item.action);
  const actionLabel = t(
    selecting ? "documents.pickAction" : "documents.openAction",
  );
  const tableColumns = showActions
    ? [...columns, { id: "open", label: actionLabel }]
    : columns;

  return (
    <WidgetShell layout="page" className="min-w-0">
      <WidgetHeader
        title={title}
        size="page"
        className="flex-wrap"
        backButton={
          isInteractive &&
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          )
        }
        actions={items.length > 0 ? create : undefined}
      />
      {statusTabs}
      {filters && (
        <Button
          type="button"
          size="sm"
          variant={activeFilters ? "secondary" : "outline"}
          className="self-start @md:hidden"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {activeFilters
            ? t("documents.activeFilters", { label: filterLabel })
            : filterLabel}
        </Button>
      )}
      {scopeSummary && !filtersOpen && (
        <Span className="text-sm text-muted-foreground @md:hidden">
          {scopeSummary}
        </Span>
      )}
      {filters && (
        <Div
          className={`${filtersOpen ? "flex" : "hidden @md:flex"} min-w-0 flex-col gap-3 rounded-lg border bg-card p-3`}
        >
          {filters}
        </Div>
      )}
      {hasError && (
        <Div role="alert">
          <ResultBanner
            variant="danger"
            title={t("documents.loadFailed")}
            message={t(
              scopeDenied
                ? "documents.scopeDenied"
                : "documents.loadFailedHint",
            )}
          >
            {isInteractive && scopeDenied && (activeFilters || filtered) && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClear}
              >
                {t("documents.clear")}
              </Button>
            )}
            {isInteractive && !scopeDenied && read && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isFetching}
                onClick={() => {
                  void read.refetch();
                }}
              >
                {t("documents.retry")}
              </Button>
            )}
          </ResultBanner>
        </Div>
      )}
      {!hasError && !pagination && <LoadingBlock message={loadingLabel} />}
      {!hasError && pagination && (
        <>
          {items.length > 0 ? (
            <RecordTable
              label={title}
              columns={tableColumns}
              footerRows={footerRows}
              rows={items.map((item) => {
                const action = isInteractive ? item.action : undefined;
                const open = action ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label={action.label}
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick();
                    }}
                  >
                    {actionLabel}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : null;
                return {
                  id: item.id,
                  cells: showActions ? { ...item.cells, open } : item.cells,
                  onOpen: action?.onClick,
                };
              })}
              compact={
                <Div className="flex min-w-0 flex-col gap-2">
                  {items.map((item) => (
                    <ListItem
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      badges={item.badges}
                      meta={
                        <>
                          {item.meta}
                          {isInteractive && item.action && (
                            <Span className="inline-flex items-center gap-1 font-medium text-primary">
                              {actionLabel}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Span>
                          )}
                        </>
                      }
                      onClick={isInteractive ? item.action?.onClick : undefined}
                    />
                  ))}
                  {pageTotals.map((row) => (
                    <Div
                      key={row.currency}
                      className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-sm"
                    >
                      <Div className="flex flex-wrap items-baseline justify-between gap-1">
                        <Span className="font-semibold">{row.title}</Span>
                        <Span className="text-xs text-muted-foreground">
                          {row.count}
                        </Span>
                      </Div>
                      {row.amounts.map((amount) => (
                        <Div
                          key={amount.column}
                          className="flex justify-between gap-2"
                        >
                          <Span>{amount.label}</Span>
                          <Span className="font-semibold tabular-nums">
                            {amount.text}
                          </Span>
                        </Div>
                      ))}
                    </Div>
                  ))}
                </Div>
              }
            />
          ) : (
            <Div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-4 pb-6">
              <EmptyBlock
                title={filtered ? t("documents.emptyTitle") : emptyTitle}
                message={filtered ? t("documents.emptyHint") : emptyHint}
                className="pb-1"
                action={
                  filtered && isInteractive
                    ? {
                        label: t("documents.clear"),
                        onClick: onClear,
                        variant: "default",
                      }
                    : undefined
                }
              />
              {!filtered && create}
            </Div>
          )}
          {pagination.total > 0 && (
            <Div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <Span className="text-muted-foreground">
                {t(
                  pagination.total === 1
                    ? "documents.pageSingle"
                    : "documents.page",
                  {
                    page: pagination.currentPage,
                    pages: pagination.pageCount,
                    total: pagination.total,
                  },
                )}
              </Span>
              {pageSize}
              {isInteractive && pagination.pageCount > 1 && (
                <Div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isFetching || pagination.currentPage <= 1}
                    onClick={() => onPage(pagination.currentPage - 1)}
                  >
                    {t("documents.previous")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      isFetching ||
                      pagination.currentPage >= pagination.pageCount
                    }
                    onClick={() => onPage(pagination.currentPage + 1)}
                  >
                    {t("documents.next")}
                  </Button>
                </Div>
              )}
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}
