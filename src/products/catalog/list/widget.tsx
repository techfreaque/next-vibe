"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
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

import { ProductType } from "../../enum";
import type definition from "./definition";
import type { CatalogListGetResponseOutput } from "./definition";

type Product = NonNullable<CatalogListGetResponseOutput["products"]>[number];

// ProductType enum values are i18n translation keys (e.g. "enums.productType.service")
// The badge label displayed comes from product.type which is also that key string
// We map to a visual variant based on which key it is
const PRODUCT_TYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [ProductType.SERVICE]: "default",
  [ProductType.PHYSICAL]: "secondary",
  [ProductType.DIGITAL]: "outline",
};

function formatPrice(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function ProductRow({
  product,
  onClick,
  locale,
  labelActive,
  labelInactive,
  labelService,
  labelPhysical,
  labelDigital,
  labelRecurring,
  labelMonthly,
  labelYearly,
}: {
  product: Product;
  onClick: () => void;
  locale: CountryLanguage;
  labelActive: string;
  labelInactive: string;
  labelService: string;
  labelPhysical: string;
  labelDigital: string;
  labelRecurring: string;
  labelMonthly: string;
  labelYearly: string;
}): JSX.Element {
  const typeVariant = PRODUCT_TYPE_VARIANT[product.type] ?? "outline";
  const typeLabel =
    product.type === ProductType.SERVICE
      ? labelService
      : product.type === ProductType.PHYSICAL
        ? labelPhysical
        : labelDigital;

  const billingIntervalLabel =
    product.billingInterval === "MONTHLY"
      ? labelMonthly
      : product.billingInterval === "YEARLY"
        ? labelYearly
        : null;

  return (
    <Div
      className={[
        "flex items-center gap-3 py-3 px-4 border-b last:border-b-0 cursor-pointer transition-colors group",
        product.isActive ? "hover:bg-muted/30" : "opacity-55 hover:bg-muted/10",
      ].join(" ")}
      onClick={onClick}
    >
      {/* Left: Name + SKU + billing interval */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {product.name}
          </Span>
          {product.isSubscription ? (
            <Badge
              variant="outline"
              className="text-xs font-medium border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
            >
              {labelRecurring}
            </Badge>
          ) : null}
        </Div>
        {product.sku ? (
          <Span className="text-xs text-muted-foreground font-mono tracking-tight">
            {product.sku}
          </Span>
        ) : null}
        {billingIntervalLabel ? (
          <Span className="text-xs text-muted-foreground">
            {billingIntervalLabel}
          </Span>
        ) : null}
      </Div>

      {/* Right: type badge, price, unit, active status */}
      <Div className="flex items-center gap-2 shrink-0">
        <Badge variant={typeVariant} className="text-xs font-medium">
          {typeLabel}
        </Badge>

        <Div className="flex items-baseline gap-1">
          <Span className="text-sm font-bold font-mono tabular-nums">
            {formatPrice(product.basePrice, product.currency, locale)}
          </Span>
          {product.unit ? (
            <Span className="text-xs text-muted-foreground">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              / {product.unit}
            </Span>
          ) : null}
        </Div>

        <Badge
          variant={product.isActive ? "default" : "secondary"}
          className={[
            "text-xs font-medium",
            product.isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              : "",
          ].join(" ")}
        >
          {product.isActive ? labelActive : labelInactive}
        </Badge>
      </Div>
    </Div>
  );
}

const SENTINEL_ALL = "__all__";
const SENTINEL_ACTIVE = "__active__";
const SENTINEL_INACTIVE = "__inactive__";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CatalogListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["products"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  // typeValue is the enum i18n key string or undefined
  const typeValue = form?.watch("filters.type");
  const isActiveValue = form?.watch("filters.isActive");

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, {});
    })();
  };

  const handleDetail = (productId: string): void => {
    if (isPickerMode) {
      const product = (data?.products ?? []).find((p) => p.id === productId);
      if (product && onPick) {
        onPick(product);
        pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[productId]/get/definition");
      navigate(def.default.GET, { urlPathParams: { productId } });
    })();
  };

  const handleCategories = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/products/category/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleTaxRates = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/tax/rate/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const labelActive = t("get.widget.active");
  const labelInactive = t("get.widget.inactive");
  const labelAddProduct = t("get.widget.addProduct");
  const labelEmpty = t("get.widget.empty");
  const labelProduct = t("get.widget.columnProduct");
  const labelTypePrice = t("get.widget.columnTypePrice");
  const labelFilterAllTypes = t("get.widget.filterAllTypes");
  const labelFilterAllStatus = t("get.widget.filterAllStatus");
  const labelFilterActiveOnly = t("get.widget.filterActiveOnly");
  const labelType = t("get.type.label");
  const labelStatus = t("get.isActive.label");
  // Enum labels (these are the translation key strings from ProductType enum)
  const labelService = t("enums.productType.service");
  const labelPhysical = t("enums.productType.physical");
  const labelDigital = t("enums.productType.digital");
  const labelRecurring = t("get.widget.recurring");
  const labelMonthly = t("get.widget.billingMonthly");
  const labelYearly = t("get.widget.billingYearly");
  const labelNavCategories = t("get.widget.navCategories");
  const labelNavTaxRates = t("get.widget.navTaxRates");

  const products = data?.products ?? [];
  const hasData = data !== undefined;

  // Map typeValue (which is an i18n key or undefined) to a Select-compatible string
  const typeSelectValue = typeValue ?? SENTINEL_ALL;

  // Map isActiveValue to a Select-compatible string
  const activeSelectValue =
    isActiveValue === true
      ? SENTINEL_ACTIVE
      : isActiveValue === false
        ? SENTINEL_INACTIVE
        : SENTINEL_ALL;

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

      {/* Quick nav to related sections — hidden in picker mode */}
      {!isPickerMode && (
        <Div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleCategories}
          >
            {labelNavCategories}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleTaxRates}
          >
            {labelNavTaxRates}
          </Button>
        </Div>
      )}

      {/* Filter bar — full mode only */}
      {!isPickerMode && form ? (
        <Div className="flex items-end gap-2 p-3 rounded-lg border bg-muted/20 flex-wrap">
          {/* Type filter */}
          <Div className="flex flex-col gap-1 min-w-[130px]">
            <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {labelType}
            </Span>
            <Select
              value={typeSelectValue}
              onValueChange={(val): void => {
                if (val === SENTINEL_ALL) {
                  form.setValue("filters.type", undefined, {
                    shouldDirty: true,
                  });
                } else if (
                  val === ProductType.SERVICE ||
                  val === ProductType.PHYSICAL ||
                  val === ProductType.DIGITAL
                ) {
                  form.setValue("filters.type", val, { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={labelFilterAllTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SENTINEL_ALL}>
                  {labelFilterAllTypes}
                </SelectItem>
                <SelectItem value={ProductType.SERVICE}>
                  {labelService}
                </SelectItem>
                <SelectItem value={ProductType.PHYSICAL}>
                  {labelPhysical}
                </SelectItem>
                <SelectItem value={ProductType.DIGITAL}>
                  {labelDigital}
                </SelectItem>
              </SelectContent>
            </Select>
          </Div>

          {/* Active filter */}
          <Div className="flex flex-col gap-1 min-w-[130px]">
            <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {labelStatus}
            </Span>
            <Select
              value={activeSelectValue}
              onValueChange={(val): void => {
                if (val === SENTINEL_ACTIVE) {
                  form.setValue("filters.isActive", true, {
                    shouldDirty: true,
                  });
                } else if (val === SENTINEL_INACTIVE) {
                  form.setValue("filters.isActive", false, {
                    shouldDirty: true,
                  });
                } else {
                  form.setValue("filters.isActive", undefined, {
                    shouldDirty: true,
                  });
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={labelFilterAllStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SENTINEL_ALL}>
                  {labelFilterAllStatus}
                </SelectItem>
                <SelectItem value={SENTINEL_ACTIVE}>
                  {labelFilterActiveOnly}
                </SelectItem>
                <SelectItem value={SENTINEL_INACTIVE}>
                  {labelInactive}
                </SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </Div>
      ) : null}

      {/* Header: count + action */}
      <Div className="flex items-center justify-between gap-3">
        {data?.total !== undefined ? (
          <Span className="text-xs text-muted-foreground tabular-nums">
            {data.total} {t("get.response.total").toLowerCase()}
          </Span>
        ) : (
          <Span />
        )}
        {!isPickerMode && (
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleCreate}
          >
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            <Span className="mr-1 font-bold">+</Span>
            {labelAddProduct}
          </Button>
        )}
      </Div>

      {/* Product list */}
      {products.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {/* Column header */}
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground">
            <Span className="flex-1">{labelProduct}</Span>
            <Span className="shrink-0">{labelTypePrice}</Span>
          </Div>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onClick={(): void => handleDetail(product.id)}
              locale={locale}
              labelActive={labelActive}
              labelInactive={labelInactive}
              labelService={labelService}
              labelPhysical={labelPhysical}
              labelDigital={labelDigital}
              labelRecurring={labelRecurring}
              labelMonthly={labelMonthly}
              labelYearly={labelYearly}
            />
          ))}
        </Div>
      ) : hasData ? (
        <Div className="flex flex-col items-center gap-3 py-14 text-center border border-dashed rounded-md">
          <Span className="text-2xl text-muted-foreground">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            📦
          </Span>
          <Span className="text-sm text-muted-foreground max-w-xs">
            {labelEmpty}
          </Span>
          {!isPickerMode && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCreate}
            >
              {labelAddProduct}
            </Button>
          )}
        </Div>
      ) : null}
    </Div>
  );
}
