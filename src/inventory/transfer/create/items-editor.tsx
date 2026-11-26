"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Label } from "next-vibe/ui/components/label";
import { NumberInput } from "next-vibe/ui/components/number-input";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { type JSX, useId } from "react";
import { z } from "zod";

import stockList from "../../stock/list/definition";
import type definition from "./definition";

/**
 * Items to move, driven by what the source warehouse actually holds: one row
 * per stocked product with its available quantity and a quantity input.
 * Writes the non-zero rows into the form's `items` array.
 */
export function TransferItemsEditor(): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const disabled = useWidgetDisabled();
  const id = useId();
  const fromWarehouseId = form.watch("fromWarehouseId");
  const items = form.watch("items") ?? [];
  const validSource = z.uuid().safeParse(fromWarehouseId).success;
  const query = useApiQuery({
    endpoint: stockList.GET,
    requestData: { warehouseId: validSource ? fromWarehouseId : undefined },
    options: { enabled: interactive && validSource },
    logger,
    user,
  });
  const levels = (query.data?.stockLevels ?? []).filter(
    (level) =>
      level.warehouseId === fromWarehouseId && level.quantityOnHand > 0,
  );
  const error = form.formState.errors.items;

  const setQuantity = (productId: string, quantity: number): void => {
    const rest = items.filter((item) => item.productId !== productId);
    form.setValue(
      "items",
      quantity > 0
        ? [...rest, { productId, quantityRequested: quantity }]
        : rest,
      { shouldDirty: true, shouldValidate: Boolean(error) },
    );
  };

  return (
    <Div className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4 @md:p-6">
      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">
          {t("transferCreate.post.widget.itemsTitle")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("transferCreate.post.items.description")}
        </Span>
      </Div>
      {!validSource ? (
        <EmptyBlock title={t("transferCreate.post.widget.pickSource")} />
      ) : query.isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : query.error ? (
        <EmptyBlock
          title={query.error.message}
          action={{
            label: t("transferGet.get.widget.retry"),
            onClick: () => void query.refetch(),
          }}
        />
      ) : !levels.length ? (
        <EmptyBlock title={t("transferCreate.post.widget.noStock")} />
      ) : (
        <Div className="divide-y rounded-lg border">
          {levels.map((level) => {
            const inputId = `${id}-${level.productId}`;
            const value =
              items.find((item) => item.productId === level.productId)
                ?.quantityRequested ?? 0;
            const over = value > level.quantityAvailable;
            return (
              <Div
                key={level.id}
                className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-3 py-3"
              >
                <Div className="flex min-w-0 flex-1 basis-48 flex-col gap-0.5">
                  <Label htmlFor={inputId} className="break-words font-medium">
                    {level.productName ??
                      t("stockList.get.widget.unnamedProduct")}
                  </Label>
                  <Span
                    className={`text-sm tabular-nums ${over ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {t("transferCreate.post.widget.available", {
                      quantity: formatQuantity(level.quantityAvailable, locale),
                    })}
                  </Span>
                </Div>
                <NumberInput
                  id={inputId}
                  min={0}
                  max={level.quantityAvailable}
                  step={1}
                  allowDecimals
                  locale={locale}
                  value={value}
                  onChange={(next) => setQuantity(level.productId, next)}
                  disabled={disabled}
                  aria-invalid={over}
                  className="w-40 max-w-full"
                />
              </Div>
            );
          })}
        </Div>
      )}
      {error && (
        <Span role="alert" className="text-sm text-destructive">
          {t("transferCreate.post.widget.itemsRequired")}
        </Span>
      )}
    </Div>
  );
}
