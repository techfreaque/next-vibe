"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import type definition from "./definition";
import type { InventoryTransferGetResponseOutput } from "./definition";

type TransferItem = NonNullable<
  NonNullable<InventoryTransferGetResponseOutput["result"]>["items"]
>[number];

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "DRAFT") {
    return "outline";
  }
  if (status === "IN_TRANSIT") {
    return "default";
  }
  if (status === "RECEIVED") {
    return "outline";
  }
  if (status === "CANCELLED") {
    return "destructive";
  }
  return "secondary";
}

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "border-amber-400 text-amber-700 dark:text-amber-400",
  IN_TRANSIT: "bg-blue-600 hover:bg-blue-600 text-white",
  RECEIVED: "border-emerald-500 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "opacity-50",
};

function formatDate(
  date: Date | string | null | undefined,
  locale: CountryLanguage,
): string {
  if (!date) {
    return "";
  }
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ItemRow({
  item,
  requestedLabel,
  receivedLabel,
}: {
  item: TransferItem;
  requestedLabel: string;
  receivedLabel: string;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-3 px-4 py-2.5 text-sm border-b last:border-b-0 hover:bg-muted/20 transition-colors">
      <Span className="flex-1 truncate font-medium">{item.productName}</Span>
      <Div className="flex items-center gap-6 shrink-0">
        <Div className="flex flex-col items-end gap-0.5">
          <Span className="text-xs text-muted-foreground">
            {requestedLabel}
          </Span>
          <Span className="font-medium tabular-nums">
            {item.quantityRequested}
          </Span>
        </Div>
        <Div className="flex flex-col items-end gap-0.5">
          <Span className="text-xs text-muted-foreground">{receivedLabel}</Span>
          <Span className="font-medium tabular-nums text-muted-foreground">
            {item.quantityReceived}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}

export function InventoryTransferGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  const handleDispatch = (): void => {
    if (!data?.result?.id) {
      return;
    }
    const transferId = data.result.id;
    void (async (): Promise<void> => {
      const def = await import("../dispatch/definition");
      navigation.push(def.default.POST, {
        data: { transferId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleReceive = (): void => {
    if (!data?.result?.id) {
      return;
    }
    const transferId = data.result.id;
    void (async (): Promise<void> => {
      const def = await import("../receive/definition");
      navigation.push(def.default.POST, {
        data: { transferId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  // Picker / loading state — no result yet
  if (!data?.result) {
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
            {t("transferGet.get.widget.back")}
          </Button>
        )}

        {data === null ? (
          <Div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          </Div>
        ) : (
          <>
            <EntityPickerFieldWidget
              fieldName="transferId"
              field={field.children.transferId}
            />
            <SubmitButtonWidget<typeof definition.GET>
              field={{ text: "transferGet.get.widget.select" as const }}
            />
          </>
        )}
      </Div>
    );
  }

  const result = data.result;
  const items = result.items ?? [];
  const isDraft = result.status === "DRAFT";
  const isInTransit = result.status === "IN_TRANSIT";

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
          {t("transferGet.get.widget.back")}
        </Button>
      )}

      {/* Header: reference + status */}
      <Div className="flex items-center justify-between">
        <Div className="flex flex-col gap-0.5">
          {result.reference ? (
            <Span className="text-sm font-semibold">{result.reference}</Span>
          ) : null}
        </Div>
        <Badge
          variant={statusVariant(result.status)}
          className={`text-xs ${STATUS_CLASS[result.status] ?? ""}`}
        >
          {result.status.replace(/_/g, " ")}
        </Badge>
      </Div>

      {/* From → To with warehouse names */}
      <Div className="rounded-lg border bg-muted/10 p-4 flex flex-col gap-3">
        <Div className="flex items-center gap-4">
          <Div className="flex-1 flex flex-col gap-1">
            <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("transferGet.get.response.fromWarehouseName")}
            </Span>
            <Span className="text-sm font-medium">
              {result.fromWarehouseName}
            </Span>
          </Div>
          <Span
            aria-hidden="true"
            className="text-2xl font-light text-muted-foreground shrink-0"
          >
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            {"\u2192"}
          </Span>
          <Div className="flex-1 flex flex-col gap-1">
            <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("transferGet.get.response.toWarehouseName")}
            </Span>
            <Span className="text-sm font-medium">
              {result.toWarehouseName}
            </Span>
          </Div>
        </Div>

        {result.notes ? (
          <Span className="text-xs text-muted-foreground italic border-t pt-2">
            {result.notes}
          </Span>
        ) : null}

        <Div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-2">
          <Span>
            {t("transferGet.get.response.createdAt")}:{" "}
            {formatDate(result.createdAt, locale)}
          </Span>
          {result.completedAt ? (
            <Span>
              {t("transferGet.get.response.completedAt")}:{" "}
              {formatDate(result.completedAt, locale)}
            </Span>
          ) : null}
        </Div>
      </Div>

      {/* Items table */}
      {items.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Span className="flex-1">
              {t("transferGet.get.response.productName")}
            </Span>
            <Div className="flex items-center gap-6 shrink-0">
              <Span className="w-20 text-right">
                {t("transferGet.get.response.quantityRequested")}
              </Span>
              <Span className="w-20 text-right">
                {t("transferGet.get.response.quantityReceived")}
              </Span>
            </Div>
          </Div>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              requestedLabel={t("transferGet.get.response.quantityRequested")}
              receivedLabel={t("transferGet.get.response.quantityReceived")}
            />
          ))}
        </Div>
      ) : null}

      {/* Action buttons based on status */}
      {(isDraft || isInTransit) && (
        <Div className="flex items-center gap-2 flex-wrap pt-2 border-t">
          {isDraft ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDispatch}
            >
              {t("transferGet.get.widget.dispatch")}
            </Button>
          ) : null}
          {isInTransit ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleReceive}
            >
              {t("transferGet.get.widget.receive")}
            </Button>
          ) : null}
        </Div>
      )}
    </Div>
  );
}
