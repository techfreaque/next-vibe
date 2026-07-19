"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { ProductType } from "../../../enum";
import type definition from "./definition";

function formatPrice(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ProductType enum values are i18n translation keys (e.g. "enums.productType.service")
// product.type at runtime holds those same key strings
const PRODUCT_TYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [ProductType.SERVICE]: "default",
  [ProductType.PHYSICAL]: "secondary",
  [ProductType.DIGITAL]: "outline",
};

export function CatalogProductGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  const handleEdit = (): void => {
    if (!data?.result?.id) {
      return;
    }
    const productId = data.result.id;
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigate(def.default.PATCH, {
        urlPathParams: { productId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleDeactivate = (): void => {
    if (!data?.result?.id) {
      return;
    }
    const productId = data.result.id;
    void (async (): Promise<void> => {
      const def = await import("../deactivate/definition");
      navigate(def.default.POST, {
        urlPathParams: { productId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const labelService = t("get.widget.typeService");
  const labelPhysical = t("get.widget.typePhysical");
  const labelDigital = t("get.widget.typeDigital");

  const handleAddToInvoice = (): void => {
    if (!data?.result) {
      return;
    }
    const { id, name, basePrice } = data.result;
    void (async (): Promise<void> => {
      const def = await import("@/payment/invoice/line/add/definition");
      navigate(def.default.POST, {
        data: {
          productId: id,
          description: name,
          unitPrice: basePrice,
          quantity: 1,
          taxRate: data.result?.defaultTaxRate ?? 0,
        },
      });
    })();
  };

  const product = data?.result;

  if (!product) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("get.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="productId"
          field={field.children.productId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "get.widget.select" as const }}
        />
      </Div>
    );
  }

  const typeVariant = PRODUCT_TYPE_VARIANT[product.type] ?? "outline";
  const typeLabel =
    product.type === ProductType.SERVICE
      ? labelService
      : product.type === ProductType.PHYSICAL
        ? labelPhysical
        : labelDigital;

  const billingIntervalLabel =
    product.billingInterval === "MONTHLY"
      ? t("get.widget.billingMonthly")
      : product.billingInterval === "YEARLY"
        ? t("get.widget.billingYearly")
        : null;

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back nav */}
      {canGoBack && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="self-start gap-1.5 -ml-1"
          onClick={() => pop()}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("get.widget.back")}
        </Button>
      )}

      {/* Header */}
      <Div className="flex items-start justify-between gap-3">
        <Div className="flex flex-col gap-1.5 min-w-0">
          <Span className="text-lg font-semibold leading-tight">
            {product.name}
          </Span>
          <Div className="flex items-center gap-2 flex-wrap">
            {product.sku ? (
              <Span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {product.sku}
              </Span>
            ) : null}
            <Badge variant={typeVariant} className="text-xs">
              {typeLabel}
            </Badge>
            {product.isSubscription ? (
              <Badge
                variant="outline"
                className="text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
              >
                {t("get.widget.recurring")}
              </Badge>
            ) : null}
            <Badge
              variant={product.isActive ? "default" : "secondary"}
              className={[
                "text-xs",
                product.isActive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "",
              ].join(" ")}
            >
              {product.isActive
                ? t("get.widget.active")
                : t("get.widget.inactive")}
            </Badge>
          </Div>
        </Div>
        <Div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddToInvoice}
          >
            {t("get.widget.addToInvoice")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleEdit}
          >
            {t("get.widget.edit")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDeactivate}
          >
            {product.isActive
              ? t("get.widget.deactivate")
              : t("get.widget.activate")}
          </Button>
        </Div>
      </Div>

      {/* Price */}
      <Div className="rounded-lg border p-3 flex items-center justify-between">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("get.response.basePrice")}
          </Span>
          <Div className="flex items-baseline gap-1">
            <Span className="text-xl font-bold font-mono">
              {formatPrice(product.basePrice, product.currency, locale)}
            </Span>
            {product.unit ? (
              <Span className="text-xs text-muted-foreground">
                {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                / {product.unit}
              </Span>
            ) : null}
          </Div>
          {billingIntervalLabel ? (
            <Span className="text-xs text-muted-foreground">
              {billingIntervalLabel}
            </Span>
          ) : null}
        </Div>
        {product.defaultTaxRate !== null &&
        product.defaultTaxRate !== undefined ? (
          <Div className="text-right">
            <Span className="text-xs text-muted-foreground block">
              {t("get.response.defaultTaxRate")}
            </Span>
            <Span className="text-sm font-mono font-semibold">
              {(product.defaultTaxRate * 100).toFixed(2)}
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              %
            </Span>
          </Div>
        ) : null}
      </Div>

      {/* Description */}
      {product.description ? (
        <Div className="flex flex-col gap-1">
          <Span className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("get.response.description")}
          </Span>
          <Span className="text-sm leading-relaxed">{product.description}</Span>
        </Div>
      ) : null}

      {/* Metadata */}
      <Div className="rounded-lg border p-3 flex flex-col gap-2">
        <Span className="text-xs text-muted-foreground uppercase tracking-wide">
          {t("get.widget.details")}
        </Span>
        <Div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {product.categoryId ? (
            <>
              <Span className="text-xs text-muted-foreground">
                {t("get.response.categoryId")}
              </Span>
              <Span className="text-xs font-mono truncate">
                {product.categoryId}
              </Span>
            </>
          ) : null}
          <Span className="text-xs text-muted-foreground">
            {t("get.response.createdAt")}
          </Span>
          <Span className="text-xs">
            {new Date(product.createdAt).toLocaleDateString(locale)}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("get.response.updatedAt")}
          </Span>
          <Span className="text-xs">
            {new Date(product.updatedAt).toLocaleDateString(locale)}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}
