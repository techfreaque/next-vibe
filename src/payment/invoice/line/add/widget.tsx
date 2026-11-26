"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  formatMoney,
  formatPercent,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useMemo } from "react";
import { useEffect, useState } from "react";

import { useDocumentVatPolicy } from "@/finance/document-vat-rates";
import { calculateInvoiceLine } from "@/payment/invoice/line/amounts";
import productLookupEndpoint from "@/pos/product-lookup/definition";

import detailDefinition from "../../[invoiceId]/get/definition";
import type definition from "./definition";

interface InvoiceLineAddWidgetProps {
  field: (typeof definition.POST)["fields"];
}

interface ProductSearchResult {
  id: string;
  name: string;
  sku: string | null;
  basePrice: number;
  currency: string;
  defaultTaxRate: number | null;
  unit: string | null;
}

export function InvoiceLineAddWidget({
  field,
}: InvoiceLineAddWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const line = data?.line;
  const documentId = form.watch("invoiceId");
  const interactive = useWidgetIsInteractive();
  const detailOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { invoiceId: documentId ?? "" },
        queryOptions: { enabled: interactive && !!documentId && !line },
      },
    }),
    [documentId, interactive, line],
  );
  const loadedDetail = useEndpoint(
    detailDefinition,
    detailOptions,
    logger,
    user,
  ).read?.data;
  const detail = loadedDetail?.id === documentId ? loadedDetail : undefined;
  const { exemptionNotice } = useDocumentVatPolicy(
    detail?.companyId ?? undefined,
    interactive && !line,
  );
  const denomination = line?.currency ?? detail?.currency;
  const fmt = (amount: number): string =>
    formatMoney(amount, denomination, locale);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // The submitted query drives the cached product-lookup call; typing does not.
  const [submittedQuery, setSubmittedQuery] = useState("");

  // Typed, cached product search via the pos/product-lookup endpoint.
  const productSearch = useApiQuery({
    endpoint: productLookupEndpoint.GET,
    requestData: {
      query: submittedQuery,
      companyId: detail?.companyId ?? undefined,
    },
    logger,
    user,
    options: {
      enabled: !!detail && submittedQuery.trim().length > 0,
      queryKey: `product-lookup:${detail?.companyId ?? ""}:${submittedQuery}`,
    },
  });
  const searchResults: ProductSearchResult[] = (
    productSearch.data?.products ?? []
  ).filter((product) => product.currency === denomination);
  const isSearching = productSearch.isFetching;
  const hasSearched = submittedQuery.trim().length > 0 && !isSearching;

  // Live preview values
  const qty = Number(form?.watch("quantity") ?? 1);
  const unitPrice = Number(form?.watch("unitPrice") ?? 0);
  const taxRate = Number(form?.watch("taxRate") ?? 0);
  useEffect(() => {
    if (exemptionNotice && taxRate !== 0) {
      form.setValue("taxRate", 0);
    }
  }, [exemptionNotice, form, taxRate]);
  const description = String(form?.watch("description") ?? "");

  const { lineTotal } = calculateInvoiceLine(
    { quantity: qty, unitPrice, taxRate },
    detail?.lineSettlement,
  );

  const handleProductSearch = (): void => {
    if (!searchQuery.trim()) {
      return;
    }
    setSubmittedQuery(searchQuery);
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
      form?.setValue("taxRate", exemptionNotice ? 0 : product.defaultTaxRate);
    }
    setSearchQuery("");
    setSubmittedQuery("");
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
      const invoiceId = form?.getValues("invoiceId") ?? line?.invoiceId ?? "";
      const def = await import("./definition");
      navigation.push(def.default.POST, {
        data: {
          invoiceId,
          description: undefined,
          productId: undefined,
          quantity: 1,
          unitPrice: undefined,
          taxRate: undefined,
        },
      });
    })();
  };

  const handleViewInvoice = (): void => {
    const invoiceId = line?.invoiceId ?? form?.getValues("invoiceId") ?? "";
    if (!invoiceId) {
      navigation.pop();
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("@/payment/invoice/[invoiceId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { invoiceId },
      });
    })();
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.viewInvoice")}
    </Button>
  ) : undefined;

  // Success state — line added
  if (line?.id) {
    return (
      <AdminForm
        title={t("post.title")}
        description={t("post.description")}
        backButton={backButton}
        secondaryActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewInvoice}
            type="button"
          >
            {t("widget.viewInvoice")}
          </Button>
        }
        primaryAction={
          <Button
            variant="default"
            size="sm"
            onClick={handleAddAnother}
            type="button"
          >
            + {t("widget.addAnotherLine")}
          </Button>
        }
      >
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={line.description}
        />

        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Span className="text-sm font-medium">{line.description}</Span>
            <Span className="text-sm font-semibold tabular-nums">
              {fmt(line.lineTotal)}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {line.quantity} {t("widget.multiplier")} {fmt(line.unitPrice)}
              {line.taxRate !== null &&
              line.taxRate !== undefined &&
              line.taxRate > 0
                ? ` + ${formatPercent(line.taxRate, locale)} ${t("widget.taxLabel")}`
                : ""}
            </Span>
            <Span className="text-sm tabular-nums">{fmt(line.lineTotal)}</Span>
          </Div>
        </Div>
      </AdminForm>
    );
  }

  const hasPreview = qty > 0 && unitPrice > 0;

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.description")}
      backButton={backButton}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.submit" }}
        />
      }
    >
      <AdminFormSection title={t("widget.searchProduct")}>
        {selectedProduct ? (
          <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between gap-3">
            <Div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <Span className="text-sm font-semibold truncate">
                {selectedProduct.name}
              </Span>
              <Div className="flex items-center gap-2">
                {selectedProduct.sku ? (
                  <Span className="text-xs tabular-nums text-muted-foreground">
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
              {t("widget.clearProduct")}
            </Button>
          </Div>
        ) : (
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
                aria-label={t("widget.searchProduct")}
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
                        <Span className="text-xs tabular-nums text-muted-foreground">
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
            ) : hasSearched && !isSearching ? (
              <Span className="text-xs text-muted-foreground px-1">
                {t("widget.noProductResults")}
              </Span>
            ) : null}
          </Div>
        )}
      </AdminFormSection>

      <AdminFormSection title={t("post.form.title")}>
        <TextFieldWidget
          fieldName="description"
          field={withValue(field.children.description, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
          <NumberFieldWidget
            fieldName="quantity"
            presentation="quantity"
            field={withValue(field.children.quantity, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="unitPrice"
            presentation="money"
            currency={denomination}
            field={withValue(field.children.unitPrice, undefined, null)}
          />
        </Div>
        {exemptionNotice ? (
          <Span className="text-sm">{exemptionNotice}</Span>
        ) : (
          <NumberFieldWidget
            fieldName="taxRate"
            presentation="percent"
            field={withValue(field.children.taxRate, undefined, null)}
          />
        )}

        {hasPreview ? (
          <Div className="rounded-lg border bg-muted/20 px-4 py-3 flex items-center justify-between">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs text-muted-foreground">
                {description ? `${description} · ` : ""}
                {qty} {t("widget.multiplier")} {fmt(unitPrice)}
                {taxRate > 0
                  ? ` + ${formatPercent(taxRate, locale)} ${t("widget.taxLabel")}`
                  : ""}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.linePreview")}
              </Span>
            </Div>
            <Span className="text-base font-semibold tabular-nums">
              {fmt(lineTotal)}
            </Span>
          </Div>
        ) : null}
      </AdminFormSection>
    </AdminForm>
  );
}
