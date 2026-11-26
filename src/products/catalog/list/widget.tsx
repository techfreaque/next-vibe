"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useState } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { ProductType } from "../../enum";
import { scopedTranslation as productsTranslation } from "../../i18n";
import {
  CREDIT_PACK_PRODUCT_IDS,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "../../repository-client";
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
        "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 border-b px-3 py-3 last:border-b-0",
        product.isActive ? "hover:bg-muted/30" : "opacity-55 hover:bg-muted/10",
      ].join(" ")}
    >
      {/* Left: Name + SKU + billing interval */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="link"
            className="h-auto min-w-0 max-w-full justify-start whitespace-normal p-0 text-left text-sm font-semibold [overflow-wrap:anywhere]"
            onClick={onClick}
          >
            {product.name}
          </Button>
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

      <Div className="flex flex-col items-end gap-1 text-right">
        <Span className="text-sm font-semibold tabular-nums">
          {formatMoney(product.basePrice, product.currency, locale)}
        </Span>
        {product.unit && (
          <Span className="text-xs text-muted-foreground">{product.unit}</Span>
        )}
      </Div>
      <Div className="col-span-2 flex flex-wrap gap-1.5">
        <Badge variant={typeVariant} className="text-xs">
          {typeLabel}
        </Badge>
        <Badge
          variant={product.isActive ? "outline" : "secondary"}
          className="text-xs"
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
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const mutations = useWidgetEndpointMutations();
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState("");
  const { t: productT } = productsTranslation.scopedT(locale);
  const companyId = form.watch("filters.companyId");
  const page = form.watch("page") ?? 1;
  const pageSize = form.watch("pageSize") ?? 20;
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
  const labelStatus = t("get.widget.status");
  // Enum labels (these are the translation key strings from ProductType enum)
  const labelService = t("enums.productType.service");
  const labelPhysical = t("enums.productType.physical");
  const labelDigital = t("enums.productType.digital");
  const labelRecurring = t("get.widget.recurring");
  const labelMonthly = t("get.widget.billingMonthly");
  const labelYearly = t("get.widget.billingYearly");
  const labelNavCategories = t("get.widget.navCategories");
  const labelNavTaxRates = t("get.widget.navTaxRates");

  const searchTerm = search.trim().toLocaleLowerCase(locale);
  const products = (data?.products ?? []).filter((product) =>
    `${product.name} ${product.sku ?? ""}`
      .toLocaleLowerCase(locale)
      .includes(searchTerm),
  );
  const checkout = [
    ...SUBSCRIPTION_TIER_PRODUCT_IDS,
    ...CREDIT_PACK_PRODUCT_IDS,
  ]
    .filter((id) => productsRepository.canPurchase(id))
    .map((id) => productsRepository.getProduct(id, locale));
  const chooseCompany = (id?: string): void => {
    form.setValue("filters.companyId", id, { shouldDirty: true });
    form.setValue("page", 1, { shouldDirty: true });
    setSearch("");
  };

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
    <WidgetShell layout={isPickerMode ? "compact" : "page"}>
      <WidgetHeader
        size={isPickerMode ? "section" : "page"}
        title={t("get.title")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="size-4" />
              {t("get.widget.back")}
            </Button>
          )
        }
        actions={
          interactive && !isPickerMode ? (
            <Button type="button" size="sm" onClick={handleCreate}>
              {labelAddProduct}
            </Button>
          ) : undefined
        }
      />
      {interactive && !isPickerMode && (
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCategories}
          >
            {labelNavCategories}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleTaxRates}
          >
            {labelNavTaxRates}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-expanded={showCheckout}
            onClick={() => setShowCheckout(!showCheckout)}
          >
            {t("get.widget.checkout")}
          </Button>
        </Div>
      )}
      {showCheckout && (
        <SectionGroup title={t("get.widget.checkout")}>
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.checkoutHint")}
          </Span>
          {checkout.map((offer) => (
            <Div key={offer.id} className="rounded-md border p-3">
              <Span className="text-sm font-semibold">
                {productT(offer.name)}
              </Span>
              <DetailGrid columns={3}>
                <DetailField
                  label={t("get.widget.checkoutReference")}
                  value={offer.id}
                />
                <DetailField
                  label={t("get.widget.checkoutCredits")}
                  value={new Intl.NumberFormat(locale).format(offer.credits)}
                />
                {offer.allowedIntervals.map((interval) => {
                  const price = productsRepository.getProduct(
                    offer.id,
                    locale,
                    interval,
                  );
                  return (
                    <DetailField
                      key={interval}
                      label={t(
                        interval === "year"
                          ? "get.widget.billingYearly"
                          : interval === "month"
                            ? "get.widget.billingMonthly"
                            : "get.widget.oneTime",
                      )}
                      value={formatMoney(price.price, price.currency, locale)}
                    />
                  );
                })}
              </DetailGrid>
            </Div>
          ))}
        </SectionGroup>
      )}

      {/* Filter bar — full mode only */}
      {interactive && !isPickerMode ? (
        <Div className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-3">
          <DocumentScopePicker
            kind="company"
            value={companyId}
            appliedLabel={data?.companyName}
            onSelect={chooseCompany}
            onClear={() => chooseCompany()}
          />
          <Input
            className="w-full @lg:w-64"
            aria-label={t("get.widget.searchPage")}
            placeholder={t("get.widget.searchPage")}
            value={search}
            onChangeText={setSearch}
          />
          <Div className="flex flex-col gap-1 min-w-[130px]">
            <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {labelType}
            </Span>
            <Select
              value={typeSelectValue}
              onValueChange={(val): void => {
                form.setValue("page", 1, { shouldDirty: true });
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
              <SelectTrigger className="h-8 text-xs" aria-label={labelType}>
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
                form.setValue("page", 1, { shouldDirty: true });
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
              <SelectTrigger className="h-8 text-xs" aria-label={labelStatus}>
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

      {data && (
        <Span className="text-sm text-muted-foreground">
          {t("get.response.total")}{" "}
          {new Intl.NumberFormat(locale).format(data.total)}
        </Span>
      )}

      {/* Product list */}
      {products.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          {/* Column header */}
          <Div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            <Span>{labelProduct}</Span>
            <Span>{labelTypePrice}</Span>
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
      ) : data ? (
        <EmptyBlock
          title={searchTerm ? t("get.widget.noMatches") : labelEmpty}
        />
      ) : response?.success === false ? (
        <EmptyBlock
          title={t("get.errors.server.title")}
          message={response.message}
          action={
            interactive
              ? {
                  label: t("get.widget.retry"),
                  onClick: () => void mutations?.read?.refetch(),
                }
              : undefined
          }
        />
      ) : (
        <LoadingBlock />
      )}
      {interactive && data && data.total > pageSize && (
        <Div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
              form.setValue("page", page - 1, { shouldDirty: true })
            }
          >
            {t("get.widget.previous")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={page * pageSize >= data.total}
            onClick={() =>
              form.setValue("page", page + 1, { shouldDirty: true })
            }
          >
            {t("get.widget.next")}
          </Button>
        </Div>
      )}
    </WidgetShell>
  );
}
