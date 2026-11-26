"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Search } from "next-vibe/ui/components/icons/Search";
import { X } from "next-vibe/ui/components/icons/X";
import { Input, type InputRefObject } from "next-vibe/ui/components/input";
import { Kbd } from "next-vibe/ui/components/kbd";
import { Label } from "next-vibe/ui/components/label";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX, RefObject } from "react";
import { useState } from "react";

import type { VatRateChoice } from "@/finance/document-vat-rates";

import type definition from "../definition";
import { parseAmount, type RegisterProduct } from "./use-register";

export interface CustomItemInput {
  description: string;
  unitPrice: number;
  taxRate: number;
}

interface ProductPanelProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmitQuery: () => void;
  searchRef: RefObject<InputRefObject | null>;
  products: RegisterProduct[];
  loading: boolean;
  currency: string;
  quantities: ReadonlyMap<string, number>;
  disabled: boolean;
  onAddProduct: (product: RegisterProduct) => void;
  onAddCustom: (item: CustomItemInput) => void;
  vatChoices: readonly VatRateChoice[];
  vatExempt: boolean;
  onOpenCatalog: () => void;
}

export function ProductPanel({
  query,
  onQueryChange,
  onSubmitQuery,
  searchRef,
  products,
  loading,
  currency,
  quantities,
  disabled,
  onAddProduct,
  onAddCustom,
  vatChoices,
  vatExempt,
  onOpenCatalog,
}: ProductPanelProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const [customOpen, setCustomOpen] = useState(false);
  const trimmed = query.trim();

  return (
    <Div className="flex min-w-0 flex-col gap-4">
      <Div className="flex flex-col gap-1.5">
        <Label htmlFor="pos-register-search" className="sr-only">
          {t("widget.search.label")}
        </Label>
        <Div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="pos-register-search"
            ref={searchRef}
            value={query}
            placeholder={t("widget.search.placeholder")}
            aria-label={t("widget.search.label")}
            autoComplete="off"
            spellCheck={false}
            className="h-12 rounded-lg pl-11 pr-11 text-base"
            onChangeText={onQueryChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmitQuery();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onQueryChange("");
              }
            }}
          />
          {trimmed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label={t("widget.search.clear")}
              onClick={() => onQueryChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </Div>
        <Span className="hidden items-center gap-1.5 text-xs text-muted-foreground @lg:flex">
          <Kbd>/</Kbd>
          {t("widget.search.hint")}
        </Span>
      </Div>

      {customOpen ? (
        <CustomItemForm
          currency={currency}
          vatChoices={vatChoices}
          vatExempt={vatExempt}
          disabled={disabled}
          onCancel={() => setCustomOpen(false)}
          onAdd={(item) => {
            onAddCustom(item);
            setCustomOpen(false);
          }}
        />
      ) : null}

      <Div className="grid grid-cols-2 gap-2.5 @md:grid-cols-3 @6xl:grid-cols-4">
        {loading
          ? [...Array.from({ length: 8 }).keys()].map((index) => (
              <Skeleton key={index} className="h-[92px] rounded-lg" />
            ))
          : products.map((product) => {
              const inCart = quantities.get(product.id) ?? 0;
              return (
                <Button
                  key={product.id}
                  type="button"
                  variant="outline"
                  size="unset"
                  disabled={disabled}
                  onClick={() => onAddProduct(product)}
                  className={`relative flex min-h-[92px] flex-col items-stretch justify-between gap-2 whitespace-normal rounded-lg p-3 text-left font-normal ${inCart > 0 ? "border-primary/60 bg-primary/5" : ""}`}
                >
                  <Span className="line-clamp-2 text-sm font-medium leading-snug">
                    {product.name}
                  </Span>
                  <Div className="flex items-end justify-between gap-2">
                    <Span className="truncate text-xs text-muted-foreground">
                      {product.sku ?? ""}
                    </Span>
                    <Span className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatMoney(product.basePrice, product.currency, locale)}
                    </Span>
                  </Div>
                  {inCart > 0 ? (
                    <Span
                      className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums"
                      aria-label={t("widget.products.inCart", {
                        count: String(inCart),
                      })}
                    >
                      {inCart}
                    </Span>
                  ) : null}
                </Button>
              );
            })}
        {!loading && !customOpen ? (
          <Button
            type="button"
            variant="outline"
            size="unset"
            disabled={disabled}
            onClick={() => setCustomOpen(true)}
            className="flex min-h-[92px] flex-col items-start justify-between gap-2 whitespace-normal rounded-lg border-dashed p-3 text-left font-normal"
          >
            <Span className="flex items-center gap-1.5 text-sm font-medium">
              <Plus className="h-4 w-4" />
              {t("widget.custom.tile")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("widget.custom.tileHint")}
            </Span>
          </Button>
        ) : null}
      </Div>

      {!loading && products.length === 0 ? (
        <Div className="flex flex-col items-start gap-2 rounded-lg border border-dashed px-4 py-5">
          <Span className="text-sm text-muted-foreground">
            {trimmed
              ? t("widget.products.none", { query: trimmed })
              : t("widget.products.emptyCatalog", { currency })}
          </Span>
          {!trimmed ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCatalog}
            >
              {t("widget.products.addProducts")}
            </Button>
          ) : null}
        </Div>
      ) : null}
    </Div>
  );
}

function CustomItemForm({
  currency,
  vatChoices,
  vatExempt,
  disabled,
  onCancel,
  onAdd,
}: {
  currency: string;
  vatChoices: readonly VatRateChoice[];
  vatExempt: boolean;
  disabled: boolean;
  onCancel: () => void;
  onAdd: (item: CustomItemInput) => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState<number>(vatChoices.at(-1)?.rate ?? 0);
  const amount = parseAmount(price);
  const valid = description.trim().length > 0 && amount !== undefined;

  const submit = (): void => {
    if (amount === undefined || !description.trim()) {
      return;
    }
    onAdd({
      description: description.trim(),
      unitPrice: amount,
      taxRate: vatExempt ? 0 : rate,
    });
  };

  return (
    <Div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <Span className="text-sm font-semibold">{t("widget.custom.title")}</Span>
      <Div className="grid grid-cols-1 gap-3 @md:grid-cols-[minmax(0,1fr)_140px]">
        <Div className="flex flex-col gap-1.5">
          <Label htmlFor="pos-custom-description">
            {t("widget.custom.description")}
          </Label>
          <Input
            id="pos-custom-description"
            value={description}
            placeholder={t("widget.custom.descriptionPlaceholder")}
            className="h-11"
            onChangeText={setDescription}
          />
        </Div>
        <Div className="flex flex-col gap-1.5">
          <Label htmlFor="pos-custom-price">
            {t("widget.custom.price")} ({currency})
          </Label>
          <Input
            id="pos-custom-price"
            value={price}
            keyboardType="decimal-pad"
            className="h-11 text-right tabular-nums"
            onChangeText={setPrice}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
          />
        </Div>
      </Div>
      {!vatExempt && vatChoices.length > 0 ? (
        <Div className="flex flex-col gap-1.5">
          <Span className="text-sm font-medium">{t("widget.custom.vat")}</Span>
          <Div className="flex flex-wrap gap-2">
            {vatChoices.map((choice) => (
              <Button
                key={choice.rate}
                type="button"
                size="sm"
                variant={choice.rate === rate ? "default" : "outline"}
                className="min-w-14 tabular-nums"
                onClick={() => setRate(choice.rate)}
              >
                {Math.round(choice.rate * 10_000) / 100} %
              </Button>
            ))}
          </Div>
        </Div>
      ) : null}
      <Div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("widget.custom.cancel")}
        </Button>
        <Button type="button" disabled={!valid || disabled} onClick={submit}>
          {t("widget.custom.add")}
        </Button>
      </Div>
    </Div>
  );
}
