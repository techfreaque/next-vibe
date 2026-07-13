"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe/ui/ui/icons/Loader2";
import { Span } from "next-vibe/ui/ui/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useState } from "react";

import type definition from "./definition";
import type { InventoryTransferListGetResponseOutput } from "./definition";

type TransferItem = NonNullable<
  InventoryTransferListGetResponseOutput["transfers"]
>[number];

type StatusFilter = "ALL" | "DRAFT" | "IN_TRANSIT" | "RECEIVED" | "CANCELLED";

function formatDate(
  date: Date | string | null | undefined,
  locale: string,
): string {
  if (!date) {
    return "";
  }
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "DRAFT") {
    return "outline";
  }
  if (status === "IN_TRANSIT") {
    return "default";
  }
  if (status === "RECEIVED") {
    return "outline";
  }
  return "secondary";
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  DRAFT: "border-amber-400 text-amber-700 dark:text-amber-400",
  IN_TRANSIT: "bg-blue-600 hover:bg-blue-600 text-white",
  RECEIVED: "border-emerald-500 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "opacity-50",
};

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

function TransferRow({
  transfer,
  onView,
  arrowLabel,
  locale,
}: {
  transfer: TransferItem;
  onView: (id: string) => void;
  arrowLabel: string;
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Div
      className="flex items-center gap-3 py-3 px-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => {
        onView(transfer.id);
      }}
    >
      {/* From → To warehouse names */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Div className="flex items-center gap-1.5 text-sm font-medium">
          <Span className="truncate max-w-[140px]">
            {transfer.fromWarehouseName}
          </Span>
          <Span className="text-muted-foreground shrink-0">{arrowLabel}</Span>
          <Span className="truncate max-w-[140px]">
            {transfer.toWarehouseName}
          </Span>
        </Div>
        <Div className="flex items-center gap-2">
          {transfer.reference ? (
            <Span className="text-xs font-medium text-muted-foreground">
              {transfer.reference}
            </Span>
          ) : null}
          <Span className="text-xs text-muted-foreground">
            {formatDate(transfer.createdAt, locale)}
          </Span>
        </Div>
      </Div>

      {/* Status badge */}
      <Badge
        variant={statusBadgeVariant(transfer.status)}
        className={`text-xs h-5 px-2 shrink-0 ${STATUS_BADGE_CLASS[transfer.status] ?? ""}`}
      >
        {statusLabel(transfer.status)}
      </Badge>
    </Div>
  );
}

const STATUS_TABS: StatusFilter[] = [
  "ALL",
  "DRAFT",
  "IN_TRANSIT",
  "RECEIVED",
  "CANCELLED",
];

export function InventoryTransferListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["transfers"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const handleView = (transferId: string): void => {
    if (isPickerMode) {
      const transfer = (data?.transfers ?? []).find(
        (tr) => tr.id === transferId,
      );
      if (transfer && onPick) {
        onPick(transfer);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[transferId]/get/definition");
      navigation.push(def.default.GET, {
        data: { transferId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[transferId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            transferId: responseData.result.id,
          }),
        },
      });
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <Span className="text-sm">{t("transferList.get.widget.loading")}</Span>
      </Div>
    );
  }

  const allRows = data.transfers ?? [];
  const filteredRows =
    statusFilter === "ALL"
      ? allRows
      : allRows.filter((r) => r.status === statusFilter);

  const countFor = (s: StatusFilter): number =>
    s === "ALL" ? allRows.length : allRows.filter((r) => r.status === s).length;

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            navigation.pop();
          }}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("transferList.get.widget.back")}
        </Button>
      )}

      {/* Header + New Transfer */}
      <Div className="flex items-center justify-between">
        <Span className="text-sm font-medium">
          {allRows.length} {t("transferList.get.widget.total")}
        </Span>
        {!isPickerMode && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCreate}
          >
            {t("transferList.get.widget.newTransfer")}
          </Button>
        )}
      </Div>

      {/* Status tabs — full mode only */}
      {!isPickerMode && (
        <Div className="flex items-center gap-1 border-b pb-0 -mb-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const count = countFor(tab);
            const isActive = statusFilter === tab;
            return (
              <Button
                key={tab}
                type="button"
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs rounded-none border-b-2 shrink-0 ${
                  isActive
                    ? "border-b-foreground font-medium"
                    : "border-b-transparent text-muted-foreground"
                }`}
                onClick={() => {
                  setStatusFilter(tab);
                }}
              >
                {tab === "ALL"
                  ? t("transferList.get.widget.tabAll")
                  : tab === "DRAFT"
                    ? t("transferList.get.widget.tabDraft")
                    : tab === "IN_TRANSIT"
                      ? t("transferList.get.widget.tabInTransit")
                      : tab === "RECEIVED"
                        ? t("transferList.get.widget.tabReceived")
                        : t("transferList.get.widget.tabCancelled")}
                {count > 0 ? (
                  <Span className="ml-1.5 text-xs font-normal tabular-nums opacity-60">
                    {count}
                  </Span>
                ) : null}
              </Button>
            );
          })}
        </Div>
      )}

      {/* Transfer table */}
      {filteredRows.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {!isPickerMode && (
            <Div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Span className="flex-1">
                {t("transferList.get.response.fromWarehouseName")}{" "}
                {t("transferList.get.widget.arrowSeparator")}{" "}
                {t("transferList.get.response.toWarehouseName")}
              </Span>
              <Span className="shrink-0">
                {t("transferList.get.response.status")}
              </Span>
            </Div>
          )}
          {filteredRows.map((transfer) => (
            <TransferRow
              key={transfer.id}
              transfer={transfer}
              onView={handleView}
              arrowLabel={t("transferList.get.widget.arrowSeparator")}
              locale={locale}
            />
          ))}
        </Div>
      ) : null}

      {/* Empty state */}
      {filteredRows.length === 0 ? (
        <Div className="flex flex-col items-center gap-3 py-16 text-center border rounded-lg border-dashed">
          <Div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Span className="text-xl">
              {t("transferList.get.widget.emptyIcon")}
            </Span>
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {t("transferList.get.widget.empty")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("transferList.get.widget.emptyHint")}
            </Span>
          </Div>
          {statusFilter === "ALL" && !isPickerMode ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCreate}
            >
              {t("transferList.get.widget.newTransfer")}
            </Button>
          ) : null}
        </Div>
      ) : null}
    </Div>
  );
}
