"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Package } from "next-vibe/ui/components/icons/Package";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatMoney,
  formatPercent,
} from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import type definition from "./definition";
import type { PosProductLookupGetResponseOutput } from "./definition";

type ProductRow = PosProductLookupGetResponseOutput["products"][number];

export function PosProductLookupWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const onPick = usePickerCallback<ProductRow>();
  const isPickerMode = !!onPick;
  const query = useWatch({ control: form.control, name: "query" }) ?? "";

  const products = data?.products ?? [];

  const pick = (product: ProductRow): void => {
    onPick?.(product);
    navigation.pop();
  };

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={
          isPickerMode
            ? t("productLookup.get.widget.pickTitle")
            : t("productLookup.get.widget.title")
        }
        subtitle={t("productLookup.get.widget.subtitle")}
        backButton={
          interactive && navigation.canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
              className="-ml-1 gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("productLookup.get.widget.back")}
            </Button>
          ) : undefined
        }
      />

      {interactive ? (
        <Div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            aria-label={t("productLookup.get.query.label")}
            placeholder={t("productLookup.get.query.placeholder")}
            className="h-11 pl-9 text-base"
            onChange={(event) =>
              form.setValue("query", String(event.target.value) || undefined, {
                shouldDirty: true,
              })
            }
          />
        </Div>
      ) : null}

      <FormAlertWidget field={{}} />

      {!data ? (
        <LoadingBlock message={t("productLookup.get.widget.loading")} />
      ) : products.length === 0 ? (
        <EmptyBlock
          icon={<Package className="h-6 w-6" />}
          title={
            query.trim()
              ? t("productLookup.get.widget.noMatchTitle", {
                  query: query.trim(),
                })
              : t("productLookup.get.widget.emptyTitle")
          }
          message={
            query.trim()
              ? t("productLookup.get.widget.noMatchMessage")
              : t("productLookup.get.widget.emptyMessage")
          }
        />
      ) : (
        <Div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
          {products.map((product) =>
            isPickerMode ? (
              <Button
                key={product.id}
                type="button"
                variant="ghost"
                className="h-auto min-h-14 justify-start rounded-none px-4 py-3 text-left"
                onClick={() => pick(product)}
              >
                <ProductLine product={product} />
              </Button>
            ) : (
              <Div key={product.id} className="min-h-14 px-4 py-3">
                <ProductLine product={product} />
              </Div>
            ),
          )}
        </Div>
      )}
    </WidgetShell>
  );
}

function ProductLine({ product }: { product: ProductRow }): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const secondary = [
    product.sku,
    product.unit
      ? t("productLookup.get.widget.perUnit", { unit: product.unit })
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <Div className="flex w-full min-w-0 items-center gap-3">
      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Span className="truncate text-sm font-medium">{product.name}</Span>
        {secondary ? (
          <Span className="truncate text-[13px] text-muted-foreground">
            {secondary}
          </Span>
        ) : null}
      </Div>
      <Div className="flex shrink-0 flex-col items-end gap-0.5">
        <Span className="whitespace-nowrap text-sm font-semibold tabular-nums">
          {formatMoney(product.basePrice, product.currency, locale)}
        </Span>
        <Span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
          {product.defaultTaxRate
            ? t("productLookup.get.widget.vat", {
                rate: formatPercent(product.defaultTaxRate, locale),
              })
            : t("productLookup.get.widget.noVat")}
        </Span>
      </Div>
    </Div>
  );
}
