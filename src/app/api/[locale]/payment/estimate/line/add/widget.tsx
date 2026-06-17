"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

interface ProductSearchResult {
  id: string;
  name: string;
  sku: string | null;
  basePrice: number;
  currency: string;
  defaultTaxRate: number | null;
  unit: string | null;
}

const fmt = (n: number): string =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export function EstimateLineAddWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const line = data?.line;

  const [selectedProduct, setSelectedProduct] =
    useState<ProductSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Live preview values
  const qty = Number(form?.watch("quantity") ?? 1);
  const unitPrice = Number(form?.watch("unitPrice") ?? 0);
  const taxRate = Number(form?.watch("taxRate") ?? 0);
  const description = String(form?.watch("description") ?? "");

  const lineSubtotal = qty * unitPrice;
  const taxAmount = lineSubtotal * taxRate;
  const lineTotal = lineSubtotal + taxAmount;

  const handleProductSearch = (): void => {
    if (!searchQuery.trim()) {
      return;
    }
    setIsSearching(true);
    setHasSearched(false);

    void (async (): Promise<void> => {
      try {
        const url = `/api/${locale}/pos/product-lookup?query=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url, { credentials: "include" });
        if (response.ok) {
          const json = (await response.json()) as {
            products?: ProductSearchResult[];
          };
          setSearchResults(json.products ?? []);
        }
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    })();
  };

  const handleSelectProduct = (product: ProductSearchResult): void => {
    setSelectedProduct(product);
    form?.setValue("productId", product.id);
    form?.setValue("description", product.name);
    form?.setValue("unitPrice", product.basePrice);
    if (
      product.defaultTaxRate !== null &&
      product.defaultTaxRate !== undefined
    ) {
      form?.setValue("taxRate", product.defaultTaxRate);
    }
    setSearchResults([]);
    setSearchQuery("");
    setHasSearched(false);
  };

  const handleClearProduct = (): void => {
    setSelectedProduct(null);
    form?.setValue("productId", undefined);
    form?.setValue("description", "");
    form?.setValue("unitPrice", 0);
    form?.setValue("taxRate", 0);
  };

  const handleAddAnother = (): void => {
    void (async (): Promise<void> => {
      const estimateId =
        form?.getValues("estimateId") ?? line?.estimateId ?? "";
      const def = await import("./definition");
      navigation.push(def.default.POST, {
        data: {
          estimateId,
          description: undefined,
          productId: undefined,
          quantity: 1,
          unitPrice: undefined,
          taxRate: undefined,
        },
      });
    })();
  };

  const handleViewEstimate = (): void => {
    const estimateId = line?.estimateId ?? form?.getValues("estimateId") ?? "";
    if (!estimateId) {
      navigation.pop();
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../[estimateId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { estimateId },
      });
    })();
  };

  // Success state — line added
  if (line?.id) {
    return (
      <Div className="flex flex-col gap-5">
        {/* Success banner */}
        <Div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-3">
          <Span className="text-emerald-500 text-lg">✓</Span>
          <Div className="flex flex-col">
            <Span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t("post.success.title")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {line.description}
            </Span>
          </Div>
        </Div>

        {/* Line details */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Span className="text-sm font-medium">{line.description}</Span>
            <Span className="text-sm font-mono font-bold tabular-nums">
              {fmt(line.lineTotal)}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {line.quantity} {t("widget.multiplier")} {fmt(line.unitPrice)}
              {line.taxRate !== null &&
              line.taxRate !== undefined &&
              line.taxRate > 0
                ? ` + ${(line.taxRate * 100).toFixed(0)}% ${t("widget.taxLabel")}`
                : ""}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {fmt(line.lineTotal)}
            </Span>
          </Div>
        </Div>

        {/* Navigation actions */}
        <Div className="flex flex-col gap-2">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleAddAnother}
            type="button"
          >
            + {t("widget.addAnotherLine")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewEstimate}
            type="button"
          >
            {t("widget.viewEstimate")}
          </Button>
        </Div>
      </Div>
    );
  }

  const hasPreview = qty > 0 && unitPrice > 0;

  return (
    <Div className="flex flex-col gap-5">
      <FormAlertWidget field={{}} />

      {/* Product search section */}
      <Div className="flex flex-col gap-2">
        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("widget.searchProduct")}
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
                  {fmt(selectedProduct.basePrice)} {selectedProduct.currency}
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
              {t("widget.clearProduct")}
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
                placeholder={t("widget.searchPlaceholder")}
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
                {isSearching ? "…" : t("widget.searchButton")}
              </Button>
            </Div>

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
                    <Span className="text-sm font-mono tabular-nums ml-3 shrink-0">
                      {fmt(product.basePrice)}{" "}
                      <Span className="text-xs">{product.currency}</Span>
                    </Span>
                  </Button>
                ))}
              </Div>
            ) : hasSearched && !isSearching ? (
              <Span className="text-xs text-muted-foreground px-1">
                {t("widget.noProductResults")}
              </Span>
            ) : null}
          </Div>
        )}
      </Div>

      {/* Or enter manually */}
      <Div className="flex items-center gap-3">
        <Div className="flex-1 border-t" />
        <Span className="text-xs text-muted-foreground shrink-0">
          {t("widget.orManual")}
        </Span>
        <Div className="flex-1 border-t" />
      </Div>

      {/* Line item form */}
      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="description"
          field={withValue(field.children.description, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="quantity"
            field={withValue(field.children.quantity, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="unitPrice"
            field={withValue(field.children.unitPrice, undefined, null)}
          />
        </Div>
        <NumberFieldWidget
          fieldName="taxRate"
          field={withValue(field.children.taxRate, undefined, null)}
        />
      </Div>

      {/* Live line total preview */}
      {hasPreview ? (
        <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {description ? `"${description}" — ` : ""}
              {qty} {t("widget.multiplier")} {fmt(unitPrice)}
              {taxRate > 0
                ? ` + ${(taxRate * 100).toFixed(0)}% ${t("widget.taxLabel")}`
                : ""}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("widget.linePreview")}
            </Span>
          </Div>
          <Span className="text-base font-mono font-bold tabular-nums">
            {fmt(lineTotal)}
          </Span>
        </Div>
      ) : null}

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
