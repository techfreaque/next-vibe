"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function InventoryWarehouseGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  const handleEdit = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigation.push(def.default.PATCH, {
        data: { warehouseId: data.result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleViewStock = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../../stock/list/definition");
      navigation.push(def.default.GET, {
        data: { warehouseId: data.result.id },
      });
    })();
  };

  // No data yet and no response — picker fallback
  if (!data?.result) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("warehouseGet.get.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="warehouseId"
          field={field.children.warehouseId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "warehouseGet.get.widget.select" as const }}
        />
      </Div>
    );
  }

  const { result } = data;

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
          {t("warehouseGet.get.widget.back")}
        </Button>
      )}

      {/* Header: name, code, status badges */}
      <Div className="flex items-start justify-between gap-3 flex-wrap">
        <Div>
          <Span className="text-xl font-semibold block">{result.name}</Span>
          <Span className="text-sm text-muted-foreground font-mono mt-0.5 block">
            {result.code}
          </Span>
        </Div>
        <Div className="flex items-center gap-1.5">
          {result.isDefault && (
            <Badge
              variant="default"
              className="text-xs bg-emerald-600 hover:bg-emerald-600"
            >
              {t("warehouseGet.get.response.isDefault")}
            </Badge>
          )}
          <Badge variant={result.isActive ? "secondary" : "outline"}>
            {result.isActive
              ? t("warehouseCreate.post.widget.active")
              : t("warehouseCreate.post.widget.inactive")}
          </Badge>
        </Div>
      </Div>

      {/* Address */}
      {result.address && (
        <Div className="text-sm">
          <Span className="text-muted-foreground block text-xs">
            {t("warehouseGet.get.response.address")}
          </Span>
          <Span>{result.address}</Span>
        </Div>
      )}

      {/* Timestamps */}
      <Div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
        <Div>
          <Span className="text-muted-foreground block text-xs">
            {t("warehouseGet.get.response.createdAt")}
          </Span>
          <Span>{new Date(result.createdAt).toLocaleDateString(locale)}</Span>
        </Div>
        <Div>
          <Span className="text-muted-foreground block text-xs">
            {t("warehouseGet.get.response.updatedAt")}
          </Span>
          <Span>{new Date(result.updatedAt).toLocaleDateString(locale)}</Span>
        </Div>
      </Div>

      {/* Actions */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button type="button" size="sm" onClick={handleViewStock}>
          {t("warehouseGet.get.widget.viewStock")}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleEdit}>
          {t("warehouseGet.get.widget.edit")}
        </Button>
      </Div>
    </Div>
  );
}
