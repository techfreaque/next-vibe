"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function VendorGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleEdit = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigation.push(def.default.PATCH, {
        urlPathParams: { vendorId: data.result.id },
      });
    })();
  };

  const handleDeactivate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../deactivate/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { vendorId: data.result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleCreateOrder = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.companyId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../../order/create/definition");
      navigation.push(def.default.POST, {
        data: {
          companyId: data.result.companyId,
          vendorId: data.result.id,
        },
      });
    })();
  };

  const handleViewOrders = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.result?.companyId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../../order/list/definition");
      navigation.push(def.default.GET, {
        data: {
          companyId: data.result.companyId,
        },
      });
    })();
  };

  if (!data?.result) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        <EntityPickerFieldWidget
          fieldName="vendorId"
          field={field.children.vendorId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "vendorGet.get.widget.select" as const }}
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
          {t("vendorGet.get.widget.back")}
        </Button>
      )}

      {/* Header */}
      <Div className="flex items-start justify-between gap-3 flex-wrap">
        <Div>
          <Span className="text-xl font-semibold block">{result.name}</Span>
          <Div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {result.code ? (
              <Span className="text-sm text-muted-foreground font-mono">
                {result.code}
              </Span>
            ) : null}
            <Badge variant={result.isActive ? "default" : "secondary"}>
              {result.isActive
                ? t("vendorList.get.widget.active")
                : t("vendorList.get.widget.inactive")}
            </Badge>
          </Div>
        </Div>
        <Div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleViewOrders}
          >
            {t("vendorGet.get.widget.viewOrders")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleEdit}
          >
            {t("vendorGet.get.widget.edit")}
          </Button>
          <Button type="button" size="sm" onClick={handleCreateOrder}>
            {t("vendorGet.get.widget.createOrder")}
          </Button>
          {result.isActive && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleDeactivate}
            >
              {t("vendorGet.get.widget.deactivate")}
            </Button>
          )}
        </Div>
      </Div>

      {/* Contact & Financial details */}
      <Div className="grid grid-cols-2 gap-3 text-sm">
        {result.email ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.email")}
            </Span>
            <Span>{result.email}</Span>
          </Div>
        ) : null}
        {result.phone ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.phone")}
            </Span>
            <Span>{result.phone}</Span>
          </Div>
        ) : null}
        {result.website ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.website")}
            </Span>
            <Span>{result.website}</Span>
          </Div>
        ) : null}
        {result.vatNumber ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.vatNumber")}
            </Span>
            <Span>{result.vatNumber}</Span>
          </Div>
        ) : null}
        <Div>
          <Span className="text-muted-foreground block text-xs">
            {t("vendorGet.get.response.defaultCurrency")}
          </Span>
          <Span className="font-mono">{result.defaultCurrency}</Span>
        </Div>
        {result.defaultPaymentTermsDays !== null ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.defaultPaymentTermsDays")}
            </Span>
            <Span>
              {t("vendorList.get.widget.paymentTermsPrefix")}{" "}
              {result.defaultPaymentTermsDays}{" "}
              {t("vendorList.get.widget.paymentTermsSuffix")}
            </Span>
          </Div>
        ) : null}
        {result.city !== null || result.country !== null ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.city")}
            </Span>
            <Span>
              {[result.city, result.country].filter(Boolean).join(", ")}
            </Span>
          </Div>
        ) : null}
        {result.taxId ? (
          <Div>
            <Span className="text-muted-foreground block text-xs">
              {t("vendorGet.get.response.taxId")}
            </Span>
            <Span>{result.taxId}</Span>
          </Div>
        ) : null}
      </Div>

      {/* Address block */}
      {result.addressLine1 ? (
        <Div className="text-sm border-t pt-3">
          <Span className="text-muted-foreground block text-xs mb-1">
            {t("vendorGet.get.response.addressLine1")}
          </Span>
          <Span className="block">{result.addressLine1}</Span>
          {result.addressLine2 ? (
            <Span className="block">{result.addressLine2}</Span>
          ) : null}
          {(result.postalCode ?? result.city ?? result.region) ? (
            <Span className="block">
              {[result.postalCode, result.city, result.region]
                .filter(Boolean)
                .join(" ")}
            </Span>
          ) : null}
        </Div>
      ) : null}

      {/* Notes */}
      {result.notes ? (
        <Div className="text-sm text-muted-foreground border-t pt-2">
          {result.notes}
        </Div>
      ) : null}
    </Div>
  );
}
