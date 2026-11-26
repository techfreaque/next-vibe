"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Input } from "next-vibe/ui/components/input";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
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

function mutedCell(text: string): JSX.Element {
  return <Span className="text-muted-foreground">{text}</Span>;
}

function skuCell(product: Product): JSX.Element {
  return product.sku ? (
    <Span
      className="block max-w-56 truncate text-muted-foreground"
      title={product.sku}
    >
      {product.sku}
    </Span>
  ) : (
    mutedCell("-")
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

  const typeLabel = (type: Product["type"]): string =>
    type === ProductType.SERVICE
      ? labelService
      : type === ProductType.PHYSICAL
        ? labelPhysical
        : labelDigital;
  const billingLabel = (product: Product): string =>
    product.billingInterval === "MONTHLY"
      ? labelMonthly
      : product.billingInterval === "YEARLY"
        ? labelYearly
        : labelRecurring;
  const statusPill = (isActive: boolean): JSX.Element => (
    <StatusPill
      status={isActive ? "active" : "inactive"}
      label={isActive ? labelActive : labelInactive}
      variant={isActive ? "success" : "muted"}
    />
  );
  const priceCell = (product: Product): JSX.Element => (
    <Span className="whitespace-nowrap tabular-nums">
      <Span
        className={
          Number(product.basePrice) === 0
            ? "text-muted-foreground"
            : "font-medium"
        }
      >
        {formatMoney(product.basePrice, product.currency, locale)}
      </Span>
      {product.unit && (
        <Span className="text-xs text-muted-foreground">{` / ${product.unit}`}</Span>
      )}
    </Span>
  );
  const nameCell = (product: Product): JSX.Element => (
    <Div className="flex min-w-0 flex-col">
      <Span className="font-medium">{product.name}</Span>
      {product.isSubscription && (
        <Span className="text-xs text-muted-foreground">
          {billingLabel(product)}
        </Span>
      )}
    </Div>
  );
  const clearFilters = (): void => {
    setSearch("");
    form.setValue("filters.type", undefined, { shouldDirty: true });
    form.setValue("filters.isActive", undefined, { shouldDirty: true });
    form.setValue("page", 1, { shouldDirty: true });
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
        subtitle={
          data && !isPickerMode
            ? t("get.widget.count", {
                count: new Intl.NumberFormat(locale).format(data.total),
              })
            : undefined
        }
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
            <>
              <Button
                type="button"
                variant="outline"
                aria-expanded={showCheckout}
                onClick={() => setShowCheckout(!showCheckout)}
              >
                {t("get.widget.checkout")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hidden @md:inline-flex"
                onClick={handleCategories}
              >
                {labelNavCategories}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hidden @md:inline-flex"
                onClick={handleTaxRates}
              >
                {labelNavTaxRates}
              </Button>
              <Button type="button" onClick={handleCreate}>
                <Plus className="size-4" aria-hidden="true" />
                {labelAddProduct}
              </Button>
            </>
          ) : undefined
        }
      />
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
          <Div className="flex min-w-[140px] flex-col">
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
              <SelectTrigger aria-label={labelType}>
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
          <Div className="flex min-w-[140px] flex-col">
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
              <SelectTrigger aria-label={labelStatus}>
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

      {products.length > 0 ? (
        <RecordTable
          label={t("get.title")}
          columns={[
            { id: "product", label: t("get.widget.columnProduct") },
            { id: "sku", label: t("get.widget.columnSku") },
            { id: "type", label: labelType },
            { id: "status", label: labelStatus },
            { id: "price", label: t("get.widget.columnPrice"), numeric: true },
          ]}
          rows={products.map((product) => ({
            id: product.id,
            onOpen: (): void => handleDetail(product.id),
            cells: {
              product: nameCell(product),
              sku: skuCell(product),
              type: mutedCell(typeLabel(product.type)),
              status: statusPill(product.isActive),
              price: priceCell(product),
            },
          }))}
          compact={
            <Div className="flex flex-col gap-2">
              {products.map((product) => (
                <ListItem
                  key={product.id}
                  title={product.name}
                  subtitle={[
                    typeLabel(product.type),
                    product.isSubscription ? billingLabel(product) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  badges={product.isActive ? undefined : statusPill(false)}
                  meta={priceCell(product)}
                  onClick={(): void => handleDetail(product.id)}
                />
              ))}
            </Div>
          }
        />
      ) : data ? (
        searchTerm || typeValue !== undefined || isActiveValue !== undefined ? (
          <EmptyBlock
            size="page"
            className="rounded-xl border bg-card"
            title={t("get.widget.noMatches")}
            action={
              interactive
                ? { label: t("get.widget.clearFilters"), onClick: clearFilters }
                : undefined
            }
          />
        ) : (
          <EmptyBlock
            size="page"
            className="rounded-xl border bg-card"
            title={t("get.widget.emptyTitle")}
            message={t("get.widget.emptyMessage")}
            action={
              interactive && !isPickerMode
                ? { label: labelAddProduct, onClick: handleCreate }
                : undefined
            }
          />
        )
      ) : response?.success === false ? (
        <EmptyBlock
          size="page"
          className="rounded-xl border bg-card"
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
