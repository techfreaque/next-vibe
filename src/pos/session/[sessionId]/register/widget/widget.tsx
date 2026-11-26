"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import type { InputRefObject } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useDeferredValue, useRef, useState } from "react";

import { useDocumentVatPolicy } from "@/finance/document-vat-rates";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "@/pos/enum";
import { formatPosSettlement } from "@/pos/order/format-settlement";
import { refreshPosOrder } from "@/pos/order/refresh";

import type definition from "../definition";
import { type CustomItemInput, ProductPanel } from "./product-panel";
import {
  CartPanel,
  ReceiptPanel,
  type TenderMethod,
  TenderPanel,
  TotalsBlock,
  VoidSaleButton,
} from "./sale-panel";
import {
  outstandingOf,
  parseAmount,
  type RegisterOrder,
  type RegisterProduct,
  toUnits,
  useRegisterActions,
  useRegisterOrder,
  useRegisterProducts,
} from "./use-register";

/** Opening time; adds the date when the till was opened on another day. */
function formatOpenedAt(openedAt: Date, locale: string): string {
  const opened = new Date(openedAt);
  const sameDay = opened.toDateString() === new Date().toDateString();
  return opened.toLocaleString(locale, {
    ...(sameDay ? {} : { day: "numeric", month: "short" }),
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Which sale the cart shows. "auto" follows the newest open sale of the
 * session, "new" is an empty cart (the sale is created on the first item),
 * "receipt" shows a sale that was just completed.
 */
type Selection =
  | { kind: "auto" }
  | { kind: "new" }
  | { kind: "order"; orderId: string }
  | { kind: "receipt"; orderId: string };

export function PosRegisterWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: { field: (typeof definition.GET)["fields"] },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const actions = useRegisterActions();

  const session = data?.session;
  const openOrders = data?.openOrders ?? [];
  const [selection, setSelection] = useState<Selection>({ kind: "auto" });
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [method, setMethod] = useState<TenderMethod>(PosPaymentMethod.CASH);
  const [amountInput, setAmountInput] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<InputRefObject | null>(null);
  const saleRef = useRef<DivRefObject | null>(null);

  const activeOrderId =
    selection.kind === "order" || selection.kind === "receipt"
      ? selection.orderId
      : selection.kind === "auto"
        ? (openOrders[0]?.id ?? data?.emptyOrderId ?? undefined)
        : undefined;
  const {
    order: loadedOrder,
    loading: orderLoading,
    refresh: refreshOrder,
  } = useRegisterOrder(activeOrderId);
  // A sale completed or voided elsewhere drops out of the cart.
  const order =
    loadedOrder &&
    (loadedOrder.status === PosOrderStatus.OPEN || selection.kind === "receipt")
      ? loadedOrder
      : undefined;

  const { products, loading: productsLoading } = useRegisterProducts(
    session?.companyId,
    session?.currency,
    deferredQuery,
  );
  const { choices: vatChoices, exemptionNotice } = useDocumentVatPolicy(
    session?.companyId,
    session !== undefined,
  );

  const busy =
    actions.create.isPending ||
    actions.addItem.isPending ||
    actions.removeItem.isPending ||
    actions.addPayment.isPending ||
    actions.removePayment.isPending ||
    actions.complete.isPending ||
    actions.voidOrder.isPending;

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-1 gap-1.5"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.back")}
    </Button>
  ) : undefined;

  if (!session) {
    return (
      <WidgetShell layout="page">
        <WidgetHeader title={t("get.title")} size="page" backButton={back} />
        <LoadingBlock />
      </WidgetShell>
    );
  }

  const money = (value: number): string =>
    formatPosSettlement(value, session.currency, locale);

  const openOrderList = async (): Promise<void> => {
    const def = await import("@/pos/order/list/definition");
    navigation.push(def.default.GET, {
      data: {
        input: { sessionId: session.id, status: undefined },
        page: 1,
        pageSize: 50,
      },
    });
  };

  if (session.status !== PosSessionStatus.OPEN) {
    return (
      <WidgetShell layout="page">
        <WidgetHeader
          title={session.terminalName}
          size="page"
          backButton={back}
        />
        <EmptyBlock
          size="page"
          title={t("widget.closed.title")}
          message={t("widget.closed.message")}
          action={{
            label: t("widget.closed.backToPos"),
            onClick: () => {
              void import("@/pos/dashboard/definition").then((def) =>
                navigation.push(def.default.GET, {}),
              );
            },
          }}
          secondaryAction={{
            label: t("widget.closed.sales"),
            onClick: () => void openOrderList(),
          }}
        />
      </WidgetShell>
    );
  }

  const report = (message: string | null): void => {
    setError(message);
  };

  const resetTender = (): void => {
    setAmountInput("");
    setReference("");
    setMethod(PosPaymentMethod.CASH);
  };

  /** Returns the id of the open sale, starting a new one when the cart is empty. */
  const ensureOrder = async (): Promise<string | undefined> => {
    // After a completed sale the next scan starts a fresh sale.
    if (order && order.status === PosOrderStatus.OPEN) {
      return order.id;
    }
    // A sale selected a moment ago may still be loading: keep using it.
    if (selection.kind === "order") {
      return selection.orderId;
    }
    const created = await actions.create.mutateAsync({
      requestData: {
        details: { sessionId: session.id, currency: session.currency },
      },
    });
    if (!created.success) {
      report(created.message);
      return undefined;
    }
    return created.data.result.id;
  };

  /**
   * Shows the sale after a change. A sale that just started is selected only
   * now, so its first read already contains the item; the open sale is
   * re-read so the cart never lags behind the till.
   */
  const showSale = async (orderId: string): Promise<void> => {
    if (orderId === activeOrderId) {
      await refreshOrder();
      return;
    }
    setSelection({ kind: "order", orderId });
    // Re-read once the cart query is mounted: on a single-connection dev
    // database the first read can race the item transaction's commit.
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
    await refreshPosOrder(orderId, logger);
  };

  const addProduct = async (product: RegisterProduct): Promise<void> => {
    report(null);
    const orderId = await ensureOrder();
    if (!orderId) {
      return;
    }
    const result = await actions.addItem.mutateAsync({
      urlPathParams: { orderId },
      requestData: {
        orderId,
        item: { productId: product.id, quantity: 1, mergeWithLine: true },
      },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    await showSale(orderId);
    setQuery("");
    searchRef.current?.focus();
  };

  const addCustom = async (item: CustomItemInput): Promise<void> => {
    report(null);
    const orderId = await ensureOrder();
    if (!orderId) {
      return;
    }
    const result = await actions.addItem.mutateAsync({
      urlPathParams: { orderId },
      requestData: {
        orderId,
        item: {
          description: item.description,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          quantity: 1,
        },
      },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    await showSale(orderId);
  };

  const changeLine = async (
    item: RegisterOrder["items"][number],
    delta: 1 | -1 | "all",
  ): Promise<void> => {
    if (!order) {
      return;
    }
    report(null);
    if (delta === 1 && item.productId) {
      const result = await actions.addItem.mutateAsync({
        urlPathParams: { orderId: order.id },
        requestData: {
          orderId: order.id,
          item: {
            productId: item.productId,
            quantity: 1,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            mergeWithLine: true,
          },
        },
      });
      if (!result.success) {
        report(result.message);
        return;
      }
      await refreshOrder();
      return;
    }
    const result = await actions.removeItem.mutateAsync({
      urlPathParams: { orderId: order.id },
      requestData: {
        details: {
          orderId: order.id,
          itemId: item.itemId,
          quantity: delta === -1 && item.quantity > 1 ? 1 : undefined,
        },
      },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    await refreshOrder();
  };

  const completeSale = async (orderId: string): Promise<void> => {
    const result = await actions.complete.mutateAsync({
      urlPathParams: { orderId },
      requestData: { orderId },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    resetTender();
    await refreshOrder();
    setSelection({ kind: "receipt", orderId });
    // Phones stack the sale under the product grid: bring the receipt up.
    saleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const takePayment = async (amount: number): Promise<void> => {
    if (!order) {
      return;
    }
    report(null);
    const due = outstandingOf(order);
    const result = await actions.addPayment.mutateAsync({
      urlPathParams: { orderId: order.id },
      requestData: {
        details: {
          orderId: order.id,
          method,
          amount,
          reference:
            method !== PosPaymentMethod.CASH && reference.trim()
              ? reference.trim()
              : undefined,
        },
      },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    setAmountInput("");
    setReference("");
    // Paid in full: finish the sale right away, like a real till.
    if (toUnits(amount) >= toUnits(due)) {
      await completeSale(order.id);
      return;
    }
    await refreshOrder();
  };

  const removePayment = async (paymentId: string): Promise<void> => {
    if (!order) {
      return;
    }
    report(null);
    const result = await actions.removePayment.mutateAsync({
      urlPathParams: { orderId: order.id },
      requestData: { paymentId },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    await refreshOrder();
  };

  const voidSale = async (): Promise<void> => {
    if (!order) {
      return;
    }
    report(null);
    const result = await actions.voidOrder.mutateAsync({
      urlPathParams: { orderId: order.id },
      requestData: { orderId: order.id },
    });
    if (!result.success) {
      report(result.message);
      return;
    }
    resetTender();
    setSelection({ kind: "new" });
  };

  /**
   * Enter in the search box. A scanner types the code and Enter faster than
   * the result list updates, so look the term up directly instead of reading
   * the (possibly stale) grid.
   */
  const submitSearch = async (): Promise<void> => {
    const term = query.trim();
    if (!term) {
      return;
    }
    const [{ apiClient }, lookup] = await Promise.all([
      import("next-vibe/unified-ui/hooks/store"),
      import("@/pos/product-lookup/definition"),
    ]);
    const found = await apiClient.fetch(
      lookup.default.GET,
      logger,
      user,
      {
        companyId: session.companyId,
        currency: session.currency,
        query: term,
        page: 1,
        pageSize: 5,
      },
      undefined,
      locale,
    );
    if (!found.success) {
      report(found.message);
      return;
    }
    const matches = found.data.products;
    const exact = matches.find(
      (product) => (product.sku ?? "").toLowerCase() === term.toLowerCase(),
    );
    const pick = exact ?? (matches.length === 1 ? matches.at(0) : undefined);
    if (pick) {
      await addProduct(pick);
    }
  };

  const primaryShortcut = (): void => {
    if (!order || busy) {
      return;
    }
    const due = outstandingOf(order);
    if (due <= 0) {
      void completeSale(order.id);
      return;
    }
    const typed = parseAmount(amountInput);
    void takePayment(typed ?? Math.round(due * 100) / 100);
  };

  const quantities = new Map<string, number>();
  for (const item of selection.kind === "receipt" ? [] : (order?.items ?? [])) {
    if (item.productId) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }
  }
  const parked = openOrders.filter((entry) => entry.id !== activeOrderId);
  const isReceipt = selection.kind === "receipt" && order !== undefined;
  const itemCount = (order?.items ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const due = order ? outstandingOf(order) : 0;

  return (
    <WidgetShell layout="page">
      <Div
        className="flex flex-col gap-5"
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            primaryShortcut();
            return;
          }
          const typing =
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement;
          if (event.key === "F2" || (event.key === "/" && !typing)) {
            event.preventDefault();
            searchRef.current?.focus();
          }
        }}
      >
        <WidgetHeader
          title={session.terminalName}
          size="page"
          backButton={back}
          subtitle={`${t("widget.subtitle", {
            company: session.companyName,
            time: formatOpenedAt(session.openedAt, locale),
          })} · ${t("widget.takings", {
            count: String(session.salesCount),
            total: money(session.salesTotal),
          })}`}
          actions={
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void openOrderList()}
              >
                {t("widget.sales")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void import("../../../close/definition").then((def) =>
                    navigation.push(def.default.POST, {
                      data: {
                        details: { sessionId: session.id, closingFloat: 0 },
                      },
                    }),
                  );
                }}
              >
                {t("widget.closeTill")}
              </Button>
            </Div>
          }
        />

        {error ? (
          <ResultBanner
            variant="danger"
            title={t("widget.error.title")}
            message={error}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => report(null)}
            >
              {t("widget.error.dismiss")}
            </Button>
          </ResultBanner>
        ) : null}

        <Div className="grid grid-cols-1 gap-5 @4xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
          <ProductPanel
            query={query}
            onQueryChange={setQuery}
            onSubmitQuery={() => void submitSearch()}
            searchRef={searchRef}
            products={products}
            loading={productsLoading}
            currency={session.currency}
            quantities={quantities}
            disabled={busy}
            onAddProduct={(product) => void addProduct(product)}
            onAddCustom={(item) => void addCustom(item)}
            vatChoices={vatChoices}
            vatExempt={exemptionNotice !== null}
            onOpenCatalog={() => {
              void import("@/products/catalog/list/definition").then((def) =>
                navigation.push(def.default.GET, {}),
              );
            }}
          />

          <Div
            ref={saleRef}
            className="flex min-w-0 flex-col self-start overflow-hidden rounded-xl border bg-card @4xl:sticky @4xl:top-4"
          >
            <Div className="flex items-center justify-between gap-2 border-b px-4 py-3">
              <Span className="truncate text-sm font-semibold">
                {order
                  ? t("widget.cart.title", { number: order.orderNumber })
                  : t("widget.cart.newTitle")}
              </Span>
            </Div>

            {parked.length > 0 && !isReceipt ? (
              <Div className="flex flex-wrap items-center gap-2 border-b px-4 py-2.5">
                <Span className="text-xs text-muted-foreground">
                  {t("widget.cart.parked")}
                </Span>
                {parked.map((entry) => (
                  <Button
                    key={entry.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      resetTender();
                      setSelection({ kind: "order", orderId: entry.id });
                    }}
                  >
                    <Span className="max-w-[220px] truncate">
                      {t("widget.cart.resume", { number: entry.orderNumber })}
                    </Span>
                    <Span className="ml-1.5 tabular-nums text-muted-foreground">
                      {money(entry.total)}
                    </Span>
                  </Button>
                ))}
              </Div>
            ) : null}

            {isReceipt && order ? (
              <ReceiptPanel
                order={order}
                onNewSale={() => {
                  resetTender();
                  setSelection({ kind: "new" });
                  searchRef.current?.focus();
                }}
                onRefund={() => {
                  void import("@/pos/order/[orderId]/refund/definition").then(
                    (def) =>
                      navigation.push(def.default.GET, {
                        urlPathParams: { orderId: order.id },
                      }),
                  );
                }}
                onOpenReceipt={() => {
                  void import("@/pos/order/[orderId]/get/definition").then(
                    (def) =>
                      navigation.push(def.default.GET, {
                        urlPathParams: { orderId: order.id },
                      }),
                  );
                }}
              />
            ) : (
              <>
                <CartPanel
                  order={order}
                  loading={orderLoading}
                  currency={session.currency}
                  busy={busy}
                  onIncrease={(item) => void changeLine(item, 1)}
                  onDecrease={(item) => void changeLine(item, -1)}
                  onRemove={(item) => void changeLine(item, "all")}
                />
                <TotalsBlock
                  order={order}
                  currency={session.currency}
                  busy={busy}
                  onRemovePayment={(paymentId) => void removePayment(paymentId)}
                />
                {order && order.items.length > 0 ? (
                  <TenderPanel
                    order={order}
                    method={method}
                    onMethodChange={(next) => {
                      setMethod(next);
                      setAmountInput("");
                    }}
                    amountInput={amountInput}
                    onAmountInputChange={setAmountInput}
                    reference={reference}
                    onReferenceChange={setReference}
                    busy={busy}
                    onTake={(amount) => void takePayment(amount)}
                    onComplete={() => void completeSale(order.id)}
                  />
                ) : null}
                {order && order.items.length > 0 ? (
                  <Div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
                    {order.payments.length === 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => {
                          resetTender();
                          setSelection({ kind: "new" });
                        }}
                      >
                        {t("widget.cart.park")}
                      </Button>
                    ) : (
                      <Span />
                    )}
                    <VoidSaleButton
                      disabled={busy}
                      blocked={order.payments.length > 0}
                      onConfirm={() => void voidSale()}
                    />
                  </Div>
                ) : null}
              </>
            )}
          </Div>
        </Div>

        {order && order.items.length > 0 && !isReceipt ? (
          <Div className="sticky bottom-0 z-20 -mx-4 -mb-8 flex items-center gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur @md:-mx-6 @4xl:hidden">
            <Div className="flex min-w-0 flex-1 flex-col">
              <Span className="text-xs text-muted-foreground">
                {t("widget.cart.items", { count: String(itemCount) })}
              </Span>
              <Span className="text-lg font-bold tabular-nums">
                {money(due > 0 ? due : order.total)}
              </Span>
            </Div>
            <Button
              type="button"
              size="lg"
              onClick={() =>
                saleRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                })
              }
            >
              {t("widget.tender.pay", { amount: money(due) })}
            </Button>
          </Div>
        ) : null}
      </Div>
    </WidgetShell>
  );
}
