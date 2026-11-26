"use client";

import {
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo } from "react";

import addItemDefinition from "@/pos/order/[orderId]/add-item/definition";
import addPaymentDefinition from "@/pos/order/[orderId]/add-payment/definition";
import completeDefinition from "@/pos/order/[orderId]/complete/definition";
import orderGetDefinition, {
  type PosOrderGetResponseOutput,
} from "@/pos/order/[orderId]/get/definition";
import removeItemDefinition from "@/pos/order/[orderId]/remove-item/definition";
import removePaymentDefinition from "@/pos/order/[orderId]/remove-payment/definition";
import voidDefinition from "@/pos/order/[orderId]/void/definition";
import orderCreateDefinition from "@/pos/order/create/definition";
import productLookupDefinition, {
  type PosProductLookupGetResponseOutput,
} from "@/pos/product-lookup/definition";

export type RegisterOrder = NonNullable<PosOrderGetResponseOutput["result"]>;
export type RegisterProduct =
  PosProductLookupGetResponseOutput["products"][number];

/** The sale shown in the cart. Keeps the last data visible while it refetches. */
export function useRegisterOrder(orderId: string | undefined): {
  order: RegisterOrder | undefined;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { orderId: orderId ?? "" },
        queryOptions: {
          enabled: interactive && orderId !== undefined,
          staleTime: 0,
        },
      },
    }),
    [orderId, interactive],
  );
  const read = useEndpoint(orderGetDefinition, options, logger, user).read;
  const order = read?.data?.result;
  return {
    order: order && order.id === orderId ? order : undefined,
    loading: orderId !== undefined && !order,
    // The mutations' definition onSuccess invalidates this query too, but the
    // till must never show a stale cart, so actions also refetch explicitly.
    refresh: async (): Promise<void> => {
      if (orderId !== undefined && read) {
        await read.refetch();
      }
    },
  };
}

/** Product grid and search. An empty query browses the active catalog. */
export function useRegisterProducts(
  companyId: string | undefined,
  currency: string | undefined,
  query: string,
): { products: RegisterProduct[]; loading: boolean } {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const search = useApiQuery({
    endpoint: productLookupDefinition.GET,
    requestData: {
      companyId,
      currency,
      query: query.trim(),
      page: 1,
      pageSize: 48,
    },
    logger,
    user,
    options: {
      enabled: interactive && companyId !== undefined,
      queryKey: `pos-register-products:${companyId ?? ""}:${currency ?? ""}:${query.trim()}`,
      staleTime: 30_000,
    },
  });
  return {
    products: search.data?.products ?? [],
    loading: search.isFetching && !search.data,
  };
}

/** Till actions. Each mutation keeps its definition's cache refresh. */
export function useRegisterActions(): {
  create: ReturnType<typeof useApiMutation<typeof orderCreateDefinition.POST>>;
  addItem: ReturnType<typeof useApiMutation<typeof addItemDefinition.POST>>;
  removeItem: ReturnType<
    typeof useApiMutation<typeof removeItemDefinition.POST>
  >;
  addPayment: ReturnType<
    typeof useApiMutation<typeof addPaymentDefinition.POST>
  >;
  removePayment: ReturnType<
    typeof useApiMutation<typeof removePaymentDefinition.POST>
  >;
  complete: ReturnType<typeof useApiMutation<typeof completeDefinition.POST>>;
  voidOrder: ReturnType<typeof useApiMutation<typeof voidDefinition.POST>>;
} {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  return {
    create: useApiMutation(
      orderCreateDefinition.POST,
      logger,
      user,
      orderCreateDefinition.POST.options?.mutationOptions,
    ),
    addItem: useApiMutation(
      addItemDefinition.POST,
      logger,
      user,
      addItemDefinition.POST.options?.mutationOptions,
    ),
    removeItem: useApiMutation(
      removeItemDefinition.POST,
      logger,
      user,
      removeItemDefinition.POST.options?.mutationOptions,
    ),
    addPayment: useApiMutation(
      addPaymentDefinition.POST,
      logger,
      user,
      addPaymentDefinition.POST.options?.mutationOptions,
    ),
    removePayment: useApiMutation(
      removePaymentDefinition.POST,
      logger,
      user,
      removePaymentDefinition.POST.options?.mutationOptions,
    ),
    complete: useApiMutation(
      completeDefinition.POST,
      logger,
      user,
      completeDefinition.POST.options?.mutationOptions,
    ),
    voidOrder: useApiMutation(
      voidDefinition.POST,
      logger,
      user,
      voidDefinition.POST.options?.mutationOptions,
    ),
  };
}

/** Money in ten-thousandths, the precision POS amounts are stored with. */
export function toUnits(amount: number): number {
  return Math.round(amount * 10_000);
}

export function outstandingOf(order: RegisterOrder): number {
  const paid = order.payments.reduce(
    (sum, payment) => sum + toUnits(payment.amount) - toUnits(payment.change),
    0,
  );
  return (toUnits(order.total) - paid) / 10_000;
}

/** Banknote suggestions above the amount due (exact first). */
export function quickCashAmounts(due: number): number[] {
  if (due <= 0) {
    return [];
  }
  const exact = Math.round(due * 100) / 100;
  const steps = [5, 10, 20, 50, 100, 200, 500];
  const suggestions = new Set<number>([exact]);
  for (const step of steps) {
    const rounded = Math.ceil(exact / step) * step;
    if (rounded > exact) {
      suggestions.add(rounded);
    }
    if (suggestions.size >= 4) {
      break;
    }
  }
  return [...suggestions];
}

/** Parses "12,50" and "12.50" alike; returns undefined for anything else. */
export function parseAmount(input: string): number | undefined {
  const normalized = input.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) {
    return undefined;
  }
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}
