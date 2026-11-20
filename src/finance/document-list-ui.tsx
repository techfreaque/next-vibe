"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import {
  getCurrentPathname,
  getCurrentSearch,
} from "next-vibe/ui/lib/location";
import {
  RelatedEntitiesPanel,
  type RelatedEntityItem,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, type ReactNode, useState } from "react";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const pickSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  privateName: z.string().optional(),
});

export function useDocumentListCopy(): ReturnType<
  typeof scopedTranslation.scopedT
>["t"] {
  return scopedTranslation.scopedT(useWidgetLocale()).t;
}

export function useDocumentListHistory(
  alias: string,
): (params: Record<string, string | number | undefined>) => void {
  const history = useSilentHistory();
  return (params): void => {
    const pathname = getCurrentPathname();
    if (!pathname.endsWith(`/tools/${alias}`)) {
      return;
    }
    const search = new URLSearchParams(getCurrentSearch());
    for (const [field, value] of Object.entries(params)) {
      search.delete(field);
      search.delete(`arg.${field}`);
      if (value !== undefined) {
        search.set(`arg.${field}`, String(value));
      }
    }
    history.replaceState(`${pathname}?${search.toString()}`);
  };
}

export function DocumentScopePicker({
  kind,
  value,
  appliedLabel,
  required = false,
  onSelect,
}: {
  kind: "company" | "customer";
  value?: string;
  appliedLabel?: string | null;
  required?: boolean;
  onSelect: (id: string) => void;
}): JSX.Element {
  const { push } = useWidgetNavigation();
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
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={label}
      title={label}
      className="h-auto min-h-9 max-w-full whitespace-normal text-start"
      onClick={openPicker}
    >
      <Span className="max-w-full [overflow-wrap:anywhere]">
        {value
          ? (selectedName ?? value)
          : required
            ? label
            : t(
                isCompany ? "documents.allCompanies" : "documents.allCustomers",
              )}
      </Span>
    </Button>
  );
}

export function DocumentList({
  title,
  backLabel,
  loadingLabel,
  emptyTitle,
  emptyHint,
  filters,
  filtered,
  items,
  pagination,
  onPage,
  onApply,
  onClear,
  create,
}: {
  title: string;
  backLabel: string;
  loadingLabel: string;
  emptyTitle: string;
  emptyHint?: string;
  filters?: ReactNode;
  filtered: boolean;
  items: RelatedEntityItem[];
  pagination?: { total: number; currentPage: number; pageCount: number };
  onPage: (page: number) => void;
  onApply: () => void;
  onClear: () => void;
  create?: ReactNode;
}): JSX.Element {
  const t = useDocumentListCopy();
  const response = useWidgetResponse();
  const { canGoBack, pop } = useWidgetNavigation();
  const isInteractive = useWidgetIsInteractive();
  const isFetching = useWidgetEndpointMutations()?.read?.isFetching ?? false;
  const hasError = response?.success === false;

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={title}
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
        actions={create}
      />
      {filters && (
        <Div className="flex min-w-0 flex-col gap-3">
          {filters}
          <Div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              disabled={isFetching}
              onClick={onApply}
            >
              {t("documents.apply")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isFetching}
              onClick={onClear}
            >
              {t("documents.clear")}
            </Button>
          </Div>
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {!hasError && !pagination && <LoadingBlock message={loadingLabel} />}
      {!hasError && pagination && (
        <>
          <RelatedEntitiesPanel
            title={t("documents.matches", { count: pagination.total })}
            emptyTitle={filtered ? t("documents.emptyTitle") : emptyTitle}
            emptyMessage={filtered ? t("documents.emptyHint") : emptyHint}
            items={items}
          />
          {pagination.total > 0 && (
            <Div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <Span className="text-muted-foreground">
                {t("documents.page", {
                  page: pagination.currentPage,
                  pages: pagination.pageCount,
                  total: pagination.total,
                })}
              </Span>
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
