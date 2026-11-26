"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  formatMoney,
  formatPercent,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { useDocumentVatPolicy } from "@/finance/document-vat-rates";
import productLookupEndpoint from "@/pos/product-lookup/definition";
import { TaxCalculator } from "@/tax/calculator";
import {
  calculateSettledTaxLine,
  LINE_SETTLEMENT_V1,
} from "@/tax/line-settlement";

import { formatPosSettlement } from "../../format-settlement";
import { useOrderPreview } from "../get/use-order-preview";
import type definition from "./definition";

interface PosOrderAddItemWidgetProps {
  field: (typeof definition.POST)["fields"];
}

interface SelectedProduct {
  id: string;
  name: string;
  sku: string | null;
  basePrice: number;
  currency: string;
  defaultTaxRate: number | null;
  unit: string | null;
}

export function PosOrderAddItemWidget({
  field,
}: PosOrderAddItemWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const result = data?.result;

  const order = useOrderPreview(result ? undefined : form.watch("orderId"));
  const { exemptionNotice } = useDocumentVatPolicy(
    order?.companyId ?? undefined,
    !result,
  );
  const currency = result?.currency ?? order?.currency;
  const fmt = (n: number): string => formatMoney(n, currency, locale);

  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // The submitted query drives the cached product-lookup call; typing does not.
  const [submittedQuery, setSubmittedQuery] = useState("");

  // Typed, cached product search via the pos/product-lookup endpoint.
  const productSearch = useApiQuery({
    endpoint: productLookupEndpoint.GET,
    requestData: { query: submittedQuery, companyId: order?.companyId },
    logger,
    user,
    options: {
      enabled: !!order?.companyId && submittedQuery.trim().length > 0,
      queryKey: `product-lookup:${order?.companyId ?? ""}:${submittedQuery}`,
    },
  });
  const searchResults: SelectedProduct[] = (
    productSearch.data?.products ?? []
  ).filter((product) => product.currency === currency);
  const isSearching = productSearch.isFetching;

  // Live preview
  const qty = Number(form?.watch("item.quantity") ?? 1);
  const unitPrice = Number(form?.watch("item.unitPrice") ?? 0);
  const taxRate = Number(form?.watch("item.taxRate") ?? 0);
  useEffect(() => {
    if (exemptionNotice && taxRate !== 0) {
      form.setValue("item.taxRate", 0);
    }
  }, [exemptionNotice, form, taxRate]);
  const description = form?.watch("item.description") ?? "";

  const previewLine = {
    quantity: qty,
    unitPrice,
    taxRate: exemptionNotice ? 0 : taxRate,
  };
  const lineTotal =
    order?.lineSettlement === LINE_SETTLEMENT_V1
      ? calculateSettledTaxLine(previewLine).lineTotal
      : TaxCalculator.calculateLineItemTax(previewLine).total;

  const handleProductSearch = (): void => {
    if (!searchQuery.trim()) {
      return;
    }
    setSubmittedQuery(searchQuery);
  };

  const handleSelectProduct = (product: SelectedProduct): void => {
    setSelectedProduct(product);
    form?.setValue("item.productId", product.id);
    form?.setValue("item.description", product.name);
    form?.setValue("item.unitPrice", product.basePrice);
    if (
      product.defaultTaxRate !== null &&
      product.defaultTaxRate !== undefined
    ) {
      form?.setValue(
        "item.taxRate",
        exemptionNotice ? 0 : product.defaultTaxRate,
      );
    }
    setSearchQuery("");
    setSubmittedQuery("");
  };

  const handleClearProduct = (): void => {
    setSelectedProduct(null);
    form?.setValue("item.productId", undefined);
    form?.setValue("item.description", "");
    form?.setValue("item.unitPrice", undefined);
    form?.setValue("item.taxRate", undefined);
  };

  const handleAddAnother = (): void => {
    void (async (): Promise<void> => {
      const orderId = form.getValues("orderId");
      if (!orderId) {
        return;
      }
      const def = await import("./definition");
      navigation.push(def.default.POST, {
        urlPathParams: { orderId },
        data: {
          orderId,
          item: {
            productId: undefined,
            description: undefined,
            quantity: 1,
            unitPrice: undefined,
            taxRate: undefined,
          },
        },
      });
    })();
  };

  const handleBackToOrder = (): void => {
    const orderId = form.getValues("orderId");
    if (!orderId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, { urlPathParams: { orderId } });
    })();
  };

  // Success state — item added
  if (result?.id) {
    return (
      <Div className="flex flex-col gap-5">
        {/* Added item summary */}
        <Div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 flex items-center gap-3">
          <Span className="text-green-500 text-lg">✓</Span>
          <Div className="flex flex-col">
            <Span className="text-sm font-semibold text-green-700 dark:text-green-400">
              {t("orderAddItem.post.success.title")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {result.description}
            </Span>
          </Div>
        </Div>

        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Span className="text-sm font-medium">{result.description}</Span>
            <Span className="text-sm font-semibold tabular-nums">
              {fmt(result.lineTotal)}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {formatQuantity(result.quantity, locale)}{" "}
              {t("orderAddItem.post.widget.multiplier")}{" "}
              {formatPosSettlement(result.unitPrice, currency, locale)}
            </Span>
            <Span className="text-sm tabular-nums">
              {fmt(result.lineTotal)}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm font-semibold">
              {t("orderAddItem.post.response.orderTotal")}
            </Span>
            <Span className="text-base font-semibold tabular-nums">
              {fmt(result.orderTotal)}
            </Span>
          </Div>
        </Div>

        <Div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleAddAnother}
          >
            + {t("orderAddItem.post.widget.addAnother")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleBackToOrder}
          >
            {t("orderAddItem.post.widget.backToOrder")}
          </Button>
        </Div>
      </Div>
    );
  }

  const hasPreview = qty > 0 && unitPrice > 0;

  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderAddItem.post.widget.backToOrder")}
        </Button>
      )}
      <FormAlertWidget field={{}} />
      <EntityPickerFieldWidget
        fieldName="orderId"
        field={field.children.orderId}
      />

      {/* === Product search section === */}
      <Div className="flex flex-col gap-2">
        <Span className="text-sm font-medium text-foreground">
          {t("orderAddItem.post.widget.searchProduct")}
        </Span>

        {selectedProduct ? (
          /* Selected product chip */
          <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between gap-3">
            <Div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <Span className="text-sm font-semibold truncate">
                {selectedProduct.name}
              </Span>
              <Div className="flex items-center gap-2">
                {selectedProduct.sku ? (
                  <Span className="text-xs font-mono text-muted-foreground">
                    {selectedProduct.sku}
                  </Span>
                ) : null}
                <Span className="text-xs text-muted-foreground">
                  {formatMoney(
                    selectedProduct.basePrice,
                    selectedProduct.currency,
                    locale,
                  )}
                </Span>
              </Div>
            </Div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs shrink-0"
              onClick={handleClearProduct}
              type="button"
            >
              {t("orderAddItem.post.widget.clearProduct")}
            </Button>
          </Div>
        ) : (
          /* Search input + button */
          <Div className="flex flex-col gap-2">
            <Div className="flex gap-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleProductSearch();
                  }
                }}
                placeholder={t("orderAddItem.post.widget.searchPlaceholder")}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleProductSearch}
                type="button"
                disabled={isSearching}
                className="shrink-0"
              >
                {isSearching ? "…" : t("orderAddItem.post.widget.searchButton")}
              </Button>
            </Div>

            {/* Search results dropdown */}
            {searchResults.length > 0 ? (
              <Div className="rounded-lg border overflow-hidden divide-y shadow-sm">
                {searchResults.map((product) => (
                  <Button
                    key={product.id}
                    variant="ghost"
                    className="w-full rounded-none h-auto px-3 py-2 flex items-center justify-between text-left"
                    onClick={() => handleSelectProduct(product)}
                    type="button"
                  >
                    <Div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <Span className="text-sm font-medium truncate">
                        {product.name}
                      </Span>
                      {product.sku ? (
                        <Span className="text-xs font-mono text-muted-foreground">
                          {product.sku}
                        </Span>
                      ) : null}
                    </Div>
                    <Span className="text-sm tabular-nums ml-3 shrink-0">
                      {formatMoney(product.basePrice, product.currency, locale)}
                    </Span>
                  </Button>
                ))}
              </Div>
            ) : searchResults.length === 0 &&
              searchQuery &&
              !isSearching &&
              data !== null &&
              data !== undefined ? (
              <Span className="text-xs text-muted-foreground px-1">
                {t("orderAddItem.post.widget.noProductResults")}
              </Span>
            ) : null}
          </Div>
        )}
      </Div>

      {/* === Or enter manually === */}
      <Div className="flex items-center gap-3">
        <Div className="flex-1 border-t" />
        <Span className="text-xs text-muted-foreground shrink-0">
          {t("orderAddItem.post.widget.orManual")}
        </Span>
        <Div className="flex-1 border-t" />
      </Div>

      {/* Item form */}
      <Div className="flex flex-col gap-3">
        {/* Description full width */}
        <TextFieldWidget
          fieldName="item.description"
          field={withValue(
            field.children.item.children.description,
            undefined,
            null,
          )}
        />
        {/* Quantity + price side by side */}
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="item.quantity"
            presentation="quantity"
            field={withValue(
              field.children.item.children.quantity,
              undefined,
              null,
            )}
          />
          <NumberFieldWidget
            fieldName="item.unitPrice"
            presentation="money"
            currency={currency}
            field={withValue(
              field.children.item.children.unitPrice,
              undefined,
              null,
            )}
          />
        </Div>
        {/* Tax rate — optional, collapsed feel */}
        {exemptionNotice ? (
          <Span className="text-sm">{exemptionNotice}</Span>
        ) : (
          <NumberFieldWidget
            fieldName="item.taxRate"
            presentation="percent"
            field={withValue(
              field.children.item.children.taxRate,
              undefined,
              null,
            )}
          />
        )}
      </Div>

      {/* Live line total preview */}
      {hasPreview ? (
        <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {description ? `${String(description)} · ` : ""}
              {formatQuantity(qty, locale)}{" "}
              {t("orderAddItem.post.widget.multiplier")}{" "}
              {formatPosSettlement(unitPrice, currency, locale)}
              {taxRate > 0
                ? ` + ${formatPercent(taxRate, locale)} ${t("orderAddItem.post.widget.taxNote")}`
                : ""}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("orderAddItem.post.widget.linePreview")}
            </Span>
          </Div>
          <Span className="text-base font-semibold tabular-nums">
            {fmt(lineTotal)}
          </Span>
        </Div>
      ) : null}

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderGet.get.widget.addItem" }}
      />
    </Div>
  );
}
