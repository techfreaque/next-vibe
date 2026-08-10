"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useState } from "react";

import type definition from "./definition";

const formatPrice = (amount: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

interface PosProductLookupWidgetProps {
  field: (typeof definition.GET)["fields"];
  onSelect?: (product: {
    id: string;
    name: string;
    sku: string | null;
    type: string;
    basePrice: number;
    currency: string;
    defaultTaxRate: number | null;
    unit: string | null;
  }) => void;
}

export function PosProductLookupWidget({
  field,
  onSelect,
}: PosProductLookupWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const products = data?.products ?? [];

  const handleSelect = (product: {
    id: string;
    name: string;
    sku: string | null;
    type: string;
    basePrice: number;
    currency: string;
    defaultTaxRate: number | null;
    unit: string | null;
  }): void => {
    setSelectedId(product.id);
    if (onSelect) {
      onSelect(product);
    } else {
      navigation.pop();
    }
  };

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && !onSelect && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("productLookup.get.widget.back")}
        </Button>
      )}
      <FormAlertWidget field={{}} />

      {/* Search input + submit */}
      <Div className="flex flex-col gap-2">
        <TextFieldWidget
          fieldName="query"
          field={withValue(field.children.query, undefined, null)}
        />
        <SubmitButtonWidget<typeof definition.GET> field={{}} />
      </Div>

      {/* Results list */}
      {products.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden divide-y">
          {products.map((product) => {
            const isSelected = selectedId === product.id;
            return (
              <Button
                key={product.id}
                variant={isSelected ? "default" : "ghost"}
                className="w-full rounded-none h-auto px-4 py-3 flex items-center justify-between text-left"
                onClick={() => handleSelect(product)}
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
                <Div className="flex flex-col items-end gap-0.5 ml-3 shrink-0">
                  <Span className="text-sm font-mono font-semibold tabular-nums">
                    {formatPrice(product.basePrice, locale)}{" "}
                    <Span className="text-xs font-normal">
                      {product.currency}
                    </Span>
                  </Span>
                  {product.defaultTaxRate !== null &&
                  product.defaultTaxRate !== undefined &&
                  product.defaultTaxRate > 0 ? (
                    <Span className="text-xs text-muted-foreground">
                      {(product.defaultTaxRate * 100).toFixed(0)}%{" "}
                      {t("productLookup.get.widget.tax")}
                    </Span>
                  ) : null}
                </Div>
              </Button>
            );
          })}
        </Div>
      ) : data !== null && data !== undefined ? (
        <Div className="rounded-lg border border-dashed px-4 py-6 text-center">
          <Span className="text-sm text-muted-foreground">
            {t("productLookup.get.widget.noResults")}
          </Span>
        </Div>
      ) : null}
    </Div>
  );
}
