"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { ShoppingBag } from "next-vibe/ui/components/icons/ShoppingBag";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { OrderListResponseOutput } from "./definition";

type PO = NonNullable<OrderListResponseOutput["result"]>[number];

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: "secondary",
  SENT: "outline",
  CONFIRMED: "default",
  PARTIALLY_RECEIVED: "default",
  RECEIVED: "default",
  CANCELLED: "destructive",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-slate-500",
  SENT: "text-blue-600",
  CONFIRMED: "text-emerald-600",
  PARTIALLY_RECEIVED: "text-amber-600",
  RECEIVED: "text-green-700",
  CANCELLED: "text-red-500",
};

const ALL_STATUSES = [
  "DRAFT",
  "SENT",
  "CONFIRMED",
  "PARTIALLY_RECEIVED",
  "RECEIVED",
  "CANCELLED",
] as const;

type POStatus = (typeof ALL_STATUSES)[number];

function formatDate(date: Date | null, locale: string): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isDeliveryOverdue(date: Date | null, status: string): boolean {
  if (!date) {
    return false;
  }
  if (status === "RECEIVED" || status === "CANCELLED") {
    return false;
  }
  return new Date(date) < new Date();
}

function PORow({
  po,
  onOpen,
  statusLabels,
  overdueLabel,
  deliveryArrow,
  locale,
}: {
  po: PO;
  onOpen: (id: string) => void;
  statusLabels: Record<string, string>;
  overdueLabel: string;
  deliveryArrow: string;
  locale: CountryLanguage;
}): JSX.Element {
  const statusLabel = statusLabels[po.status] ?? po.status;
  const statusColor = STATUS_COLOR[po.status] ?? "text-muted-foreground";
  const variant = STATUS_VARIANT[po.status] ?? "secondary";
  const overdue = isDeliveryOverdue(po.expectedDeliveryDate, po.status);

  return (
    <Div
      className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors border-b last:border-b-0"
      onClick={(): void => onOpen(po.id)}
    >
      {/* PO number + vendor */}
      <Div className="flex-1 min-w-0">
        <Span className="text-sm font-semibold font-mono block">
          {po.poNumber}
        </Span>
        <Span className="text-xs text-muted-foreground truncate block">
          {po.vendorName}
        </Span>
      </Div>

      {/* Dates */}
      <Div className="hidden sm:block shrink-0 text-right w-28">
        <Span className="text-xs text-muted-foreground block">
          {formatDate(po.createdAt, locale)}
        </Span>
        {po.expectedDeliveryDate ? (
          <Span
            className={[
              "text-xs block",
              overdue ? "text-red-600 font-medium" : "text-muted-foreground",
            ].join(" ")}
          >
            {deliveryArrow} {formatDate(po.expectedDeliveryDate, locale)}
            {overdue ? ` ${overdueLabel}` : ""}
          </Span>
        ) : null}
      </Div>

      {/* Amount */}
      <Div className="shrink-0 text-right min-w-[90px]">
        <Span className="text-sm font-medium">
          {po.currency} {po.total.toFixed(2)}
        </Span>
      </Div>

      {/* Status badge */}
      <Div className="shrink-0 w-24 text-right">
        <Badge
          variant={variant}
          className={["text-xs py-0 h-5", statusColor].join(" ")}
        >
          {statusLabel}
        </Badge>
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onPick = usePickerCallback<{ id: string; poNumber: string }>();
  const isPickerMode = !!onPick;

  const handleCreate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  const handleView = (poId: string): void => {
    if (isPickerMode) {
      const po = allItems.find((p) => p.id === poId);
      if (po && onPick) {
        onPick({ id: po.id, poNumber: po.poNumber });
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[poId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { poId },
      });
    })();
  };

  const handleFilterStatus = (status: POStatus | undefined): void => {
    if (!form) {
      return;
    }
    form.setValue("status", status, { shouldDirty: true });
  };

  const locale = useWidgetLocale();
  const allItems = data?.result ?? [];

  const statusLabels: Record<string, string> = {
    DRAFT: t("enums.poStatus.draft"),
    SENT: t("enums.poStatus.sent"),
    CONFIRMED: t("enums.poStatus.confirmed"),
    PARTIALLY_RECEIVED: t("enums.poStatus.partiallyReceived"),
    RECEIVED: t("enums.poStatus.received"),
    CANCELLED: t("enums.poStatus.cancelled"),
  };

  const overdueLabel = t("orderList.get.widget.overdue");
  const deliveryArrow = t("orderList.get.widget.deliveryArrow");
  const colPoVendor = t("orderList.get.widget.colPoVendor");
  const colDate = t("orderList.get.widget.colDate");
  const colAmount = t("orderList.get.widget.colAmount");
  const colStatus = t("orderList.get.widget.colStatus");

  // Count items by status for tab badges
  const countByStatus = ALL_STATUSES.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s] = allItems.filter((po) => po.status === s).length;
      return acc;
    },
    {},
  );

  const orderLabel =
    allItems.length === 1
      ? t("orderList.get.widget.order")
      : t("orderList.get.widget.orders");

  // POs that need action: confirmed+overdue, or received (needs bill conversion)
  const actionNeeded = allItems.filter(
    (po) =>
      (po.status === "CONFIRMED" &&
        isDeliveryOverdue(po.expectedDeliveryDate, po.status)) ||
      po.status === "RECEIVED",
  );

  // Picker mode — compact scannable list
  if (isPickerMode) {
    return (
      <Div className="flex flex-col divide-y divide-border">
        {allItems.length === 0 && data !== undefined ? (
          <Div className="py-8 text-center text-sm text-muted-foreground">
            {t("orderList.get.widget.empty")}
          </Div>
        ) : null}
        {!data ? (
          <Div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          </Div>
        ) : null}
        {allItems.map((po) => (
          <Div
            key={po.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 cursor-pointer"
            onClick={() => handleView(po.id)}
          >
            <Span className="text-sm font-medium font-mono">{po.poNumber}</Span>
            <Span className="text-xs text-muted-foreground">
              {po.vendorName}
            </Span>
          </Div>
        ))}
      </Div>
    );
  }

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back button */}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderList.get.widget.back")}
        </Button>
      )}

      {/* Toolbar */}
      <Div className="flex items-center justify-between gap-3">
        {data !== undefined ? (
          <Span className="text-xs text-muted-foreground">
            {allItems.length} {orderLabel}
          </Span>
        ) : (
          <Span />
        )}
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={handleCreate}
        >
          {t("orderList.get.widget.newOrder")}
        </Button>
      </Div>

      {/* Action-needed banner */}
      {actionNeeded.length > 0 && (
        <Div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
          <Span className="font-medium">
            {actionNeeded.length} {t("orderList.get.widget.actionNeeded")}
          </Span>
        </Div>
      )}

      {/* Status filter tabs */}
      {data !== undefined && (
        <Div className="flex items-center gap-1 flex-wrap">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2"
            onClick={(): void => {
              handleFilterStatus(undefined);
            }}
          >
            {t("orderList.get.widget.statusAll")}
            <Span className="ml-1 text-muted-foreground">
              ({allItems.length})
            </Span>
          </Button>
          {ALL_STATUSES.map((status) => {
            const count = countByStatus[status] ?? 0;
            if (count === 0) {
              return null;
            }
            const color = STATUS_COLOR[status] ?? "";
            return (
              <Button
                key={status}
                type="button"
                size="sm"
                variant="ghost"
                className={["h-7 text-xs px-2", color].join(" ")}
                onClick={(): void => {
                  handleFilterStatus(status);
                }}
              >
                {statusLabels[status]}
                <Span className="ml-1 text-muted-foreground">({count})</Span>
              </Button>
            );
          })}
        </Div>
      )}

      {/* Loading */}
      {!data && (
        <Div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <Span className="text-sm">{t("orderList.get.widget.loading")}</Span>
        </Div>
      )}

      {/* PO list */}
      {allItems.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {/* Column headers */}
          <Div className="flex items-center gap-4 px-4 py-2 bg-muted/40 border-b">
            <Span className="text-xs font-medium text-muted-foreground flex-1">
              {colPoVendor}
            </Span>
            <Span className="text-xs font-medium text-muted-foreground hidden sm:block shrink-0 w-28 text-right">
              {colDate}
            </Span>
            <Span className="text-xs font-medium text-muted-foreground shrink-0 min-w-[90px] text-right">
              {colAmount}
            </Span>
            <Span className="text-xs font-medium text-muted-foreground shrink-0 w-24 text-right">
              {colStatus}
            </Span>
          </Div>
          {allItems.map((po) => (
            <PORow
              key={po.id}
              po={po}
              onOpen={handleView}
              statusLabels={statusLabels}
              overdueLabel={overdueLabel}
              deliveryArrow={deliveryArrow}
              locale={locale}
            />
          ))}
        </Div>
      ) : data !== undefined ? (
        <Div className="py-14 text-center border border-dashed rounded-md flex flex-col items-center gap-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium">
              {t("orderList.get.widget.empty")}
            </Span>
          </Div>
          <Button type="button" size="sm" onClick={handleCreate}>
            {t("orderList.get.widget.newOrder")}
          </Button>
        </Div>
      ) : null}
    </Div>
  );
}
