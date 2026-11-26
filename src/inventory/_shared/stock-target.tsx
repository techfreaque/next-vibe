"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import type { JSX } from "react";
import { z } from "zod";

import productGet from "@/products/catalog/[productId]/get/definition";

import stockList from "../stock/list/definition";
import warehouseGet from "../warehouse/[warehouseId]/get/definition";

/**
 * Names the warehouse and product a stock write targets, plus what is on hand
 * now. Prefilled entity pickers hide themselves, so without this a clerk would
 * post a receipt or write-off without seeing where it lands.
 */
export function StockTarget({
  warehouseId,
  productId,
  warehouseLabel,
  productLabel,
  onHandLabel,
}: {
  warehouseId: string | undefined;
  productId: string | undefined;
  warehouseLabel: string;
  productLabel: string;
  onHandLabel: string;
}): JSX.Element | null {
  const interactive = useWidgetIsInteractive();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const validWarehouse = z.uuid().safeParse(warehouseId).success;
  const validProduct = z.uuid().safeParse(productId).success;
  const warehouse = useApiQuery({
    endpoint: warehouseGet.GET,
    urlPathParams: {
      warehouseId: validWarehouse && warehouseId ? warehouseId : "",
    },
    options: { enabled: interactive && validWarehouse },
    logger,
    user,
  });
  const product = useApiQuery({
    endpoint: productGet.GET,
    urlPathParams: { productId: validProduct && productId ? productId : "" },
    options: { enabled: interactive && validProduct },
    logger,
    user,
  });
  const level = useApiQuery({
    endpoint: stockList.GET,
    requestData: {
      warehouseId: validWarehouse ? warehouseId : undefined,
      productId: validProduct ? productId : undefined,
    },
    options: { enabled: interactive && validWarehouse && validProduct },
    logger,
    user,
  });
  const warehouseName = warehouse.data?.result?.name;
  const productName = product.data?.result?.name;
  if (!warehouseName && !productName) {
    return null;
  }
  const onHand =
    level.data?.stockLevels.find(
      (row) => row.warehouseId === warehouseId && row.productId === productId,
    )?.quantityOnHand ?? (level.data ? 0 : undefined);
  const facts = [
    { key: "warehouse", label: warehouseLabel, value: warehouseName },
    { key: "product", label: productLabel, value: productName },
    {
      key: "onHand",
      label: onHandLabel,
      value: onHand === undefined ? undefined : formatQuantity(onHand, locale),
    },
  ].filter((fact) => fact.value !== undefined);
  return (
    <Div className="grid gap-3 rounded-lg bg-muted/50 p-3 @md:grid-cols-3">
      {facts.map((fact) => (
        <Div key={fact.key} className="flex min-w-0 flex-col gap-0.5">
          <Span className="text-xs text-muted-foreground">{fact.label}</Span>
          <Span className="break-words font-medium tabular-nums">
            {fact.value}
          </Span>
        </Div>
      ))}
    </Div>
  );
}
