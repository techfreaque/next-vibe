"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Banknote } from "next-vibe/ui/components/icons/Banknote";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { X } from "next-vibe/ui/components/icons/X";
import { Input } from "next-vibe/ui/components/input";
import { Kbd } from "next-vibe/ui/components/kbd";
import { Label } from "next-vibe/ui/components/label";
import { Span } from "next-vibe/ui/components/span";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { PosPaymentMethod } from "@/pos/enum";
import { formatPosSettlement } from "@/pos/order/format-settlement";

import type definition from "../definition";
import {
  outstandingOf,
  parseAmount,
  quickCashAmounts,
  type RegisterOrder,
  toUnits,
} from "./use-register";

export type TenderMethod =
  (typeof PosPaymentMethod)[keyof typeof PosPaymentMethod];

const METHODS = [
  { method: PosPaymentMethod.CASH, key: "widget.tender.cash", Icon: Banknote },
  {
    method: PosPaymentMethod.CARD,
    key: "widget.tender.card",
    Icon: CreditCard,
  },
  {
    method: PosPaymentMethod.TRANSFER,
    key: "widget.tender.transfer",
    Icon: Wallet,
  },
  { method: PosPaymentMethod.OTHER, key: "widget.tender.other", Icon: Wallet },
] as const;

export function methodLabelKey(
  method: string,
): (typeof METHODS)[number]["key"] {
  return (
    METHODS.find((entry) => entry.method === method)?.key ??
    "widget.tender.other"
  );
}

interface CartProps {
  order: RegisterOrder | undefined;
  loading: boolean;
  currency: string;
  busy: boolean;
  onIncrease: (item: RegisterOrder["items"][number]) => void;
  onDecrease: (item: RegisterOrder["items"][number]) => void;
  onRemove: (item: RegisterOrder["items"][number]) => void;
}

export function CartPanel({
  order,
  loading,
  currency,
  busy,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const money = (value: number): string =>
    formatPosSettlement(value, order?.currency ?? currency, locale);
  const items = order?.items ?? [];
  const locked = (order?.payments.length ?? 0) > 0;

  if (items.length === 0) {
    return (
      <Div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        <Span className="text-sm text-muted-foreground">
          {loading ? "" : t("widget.cart.empty")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col">
      {locked ? (
        <Span className="flex items-center gap-1.5 px-4 pb-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          {t("widget.cart.locked")}
        </Span>
      ) : null}
      <Div className="flex flex-col divide-y">
        {items.map((item) => (
          <Div key={item.itemId} className="flex flex-col gap-1.5 px-4 py-3">
            <Div className="flex items-start justify-between gap-3">
              <Span className="min-w-0 text-sm font-medium leading-snug [overflow-wrap:anywhere]">
                {item.description}
              </Span>
              <Span className="shrink-0 text-sm font-semibold tabular-nums">
                {money(item.lineTotal)}
              </Span>
            </Div>
            <Div className="flex items-center justify-between gap-2">
              <Span className="min-w-0 truncate text-xs text-muted-foreground tabular-nums">
                {t("widget.cart.each", { price: money(item.unitPrice) })}
              </Span>
              <Div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  disabled={busy || locked}
                  aria-label={t("widget.cart.remove", {
                    name: item.description,
                  })}
                  onClick={() => onRemove(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  disabled={busy || locked}
                  aria-label={t("widget.cart.decrease", {
                    name: item.description,
                  })}
                  onClick={() => onDecrease(item)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Span className="w-10 text-center text-sm font-semibold tabular-nums">
                  {formatQuantity(item.quantity, locale)}
                </Span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  disabled={busy || locked || item.productId === null}
                  aria-label={t("widget.cart.increase", {
                    name: item.description,
                  })}
                  onClick={() => onIncrease(item)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Div>
            </Div>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

export function TotalsBlock({
  order,
  currency,
  busy = false,
  onRemovePayment,
}: {
  order: RegisterOrder | undefined;
  currency: string;
  busy?: boolean;
  onRemovePayment?: (paymentId: string) => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const money = (value: number): string =>
    formatPosSettlement(value, order?.currency ?? currency, locale);
  const total = order?.total ?? 0;
  const due = order ? outstandingOf(order) : 0;
  const paid = order ? total - due : 0;
  const change = (order?.payments ?? []).reduce(
    (sum, payment) => sum + toUnits(payment.change),
    0,
  );

  return (
    <Div className="flex flex-col gap-1.5 border-t px-4 py-3">
      <Row
        label={t("widget.cart.subtotal")}
        value={money(order?.subtotal ?? 0)}
      />
      {order?.taxExemptionNotice ? (
        <Span className="text-xs text-muted-foreground">
          {order.taxExemptionNotice}
        </Span>
      ) : (
        <Row
          label={t("widget.cart.vat")}
          value={money(order?.taxAmount ?? 0)}
        />
      )}
      <Div className="flex items-baseline justify-between gap-3 pt-1">
        <Span className="text-base font-semibold">
          {t("widget.cart.total")}
        </Span>
        <Span
          className="text-3xl font-bold tabular-nums"
          data-testid="pos-register-total"
        >
          {money(total)}
        </Span>
      </Div>
      {order && order.payments.length > 0 ? (
        <>
          {order.payments.map((payment) => (
            <Div
              key={payment.paymentId}
              className="flex items-center justify-between gap-2 text-sm text-muted-foreground"
            >
              <Span>{t(methodLabelKey(payment.method))}</Span>
              <Div className="flex items-center gap-1">
                <Span className="tabular-nums">{money(payment.amount)}</Span>
                {onRemovePayment ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={busy}
                    aria-label={t("widget.cart.removePayment", {
                      method: t(methodLabelKey(payment.method)),
                    })}
                    onClick={() => onRemovePayment(payment.paymentId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </Div>
            </Div>
          ))}
          {change > 0 ? (
            <Row
              label={t("widget.cart.change")}
              value={money(change / 10_000)}
              muted
            />
          ) : null}
          <Row
            label={due > 0 ? t("widget.cart.due") : t("widget.cart.paid")}
            value={money(due > 0 ? due : paid)}
            strong
          />
        </>
      ) : null}
    </Div>
  );
}

function Row({
  label,
  value,
  muted = false,
  strong = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center justify-between gap-3 text-sm ${muted ? "text-muted-foreground" : ""} ${strong ? "font-semibold" : ""}`}
    >
      <Span>{label}</Span>
      <Span className="tabular-nums">{value}</Span>
    </Div>
  );
}

interface TenderProps {
  order: RegisterOrder;
  method: TenderMethod;
  onMethodChange: (method: TenderMethod) => void;
  amountInput: string;
  onAmountInputChange: (value: string) => void;
  reference: string;
  onReferenceChange: (value: string) => void;
  busy: boolean;
  onTake: (amount: number) => void;
  onComplete: () => void;
}

export function TenderPanel({
  order,
  method,
  onMethodChange,
  amountInput,
  onAmountInputChange,
  reference,
  onReferenceChange,
  busy,
  onTake,
  onComplete,
}: TenderProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const money = (value: number): string =>
    formatPosSettlement(value, order.currency, locale);
  const due = outstandingOf(order);

  if (due <= 0) {
    return (
      <Div className="flex flex-col gap-2 border-t px-4 py-4">
        <Button
          type="button"
          size="unset"
          className="h-14 w-full text-base font-semibold"
          disabled={busy}
          onClick={onComplete}
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {t("widget.tender.complete")}
        </Button>
      </Div>
    );
  }

  const typed = parseAmount(amountInput);
  const amount = typed ?? Math.round(due * 100) / 100;
  const isCash = method === PosPaymentMethod.CASH;
  // Only cash can exceed the amount due; the drawer returns the change.
  const capped = isCash
    ? amount
    : Math.min(amount, Math.round(due * 100) / 100);
  const change = isCash
    ? Math.max(0, (toUnits(amount) - toUnits(due)) / 10_000)
    : 0;
  const invalid = amountInput.trim() !== "" && typed === undefined;

  return (
    <Div className="flex flex-col gap-3 border-t px-4 py-4">
      <Span className="text-sm font-semibold">{t("widget.tender.title")}</Span>
      <Div className="grid grid-cols-4 gap-2">
        {METHODS.map(({ method: value, key, Icon }) => (
          <Button
            key={value}
            type="button"
            size="unset"
            variant={method === value ? "default" : "outline"}
            className="flex h-14 flex-col gap-1 px-1 text-xs"
            onClick={() => onMethodChange(value)}
          >
            <Icon className="h-4 w-4" />
            {t(key)}
          </Button>
        ))}
      </Div>
      <Div className="flex flex-col gap-1.5">
        <Label htmlFor="pos-tender-amount">{t("widget.tender.amount")}</Label>
        <Input
          id="pos-tender-amount"
          value={amountInput}
          placeholder={money(due)}
          keyboardType="decimal-pad"
          aria-invalid={invalid}
          className="h-12 text-right text-lg font-semibold tabular-nums"
          onChangeText={onAmountInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !invalid) {
              event.preventDefault();
              onTake(capped);
            }
          }}
        />
      </Div>
      {isCash ? (
        <Div className="grid grid-cols-4 gap-2">
          {quickCashAmounts(due).map((value, index) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              size="unset"
              className="h-11 text-sm tabular-nums"
              disabled={busy}
              onClick={() => onTake(value)}
            >
              {index === 0 ? t("widget.tender.exact") : money(value)}
            </Button>
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col gap-1.5">
          <Label htmlFor="pos-tender-reference">
            {t("widget.tender.reference")}
          </Label>
          <Input
            id="pos-tender-reference"
            value={reference}
            maxLength={255}
            placeholder={t("widget.tender.referencePlaceholder")}
            className="h-11"
            onChangeText={onReferenceChange}
          />
        </Div>
      )}
      {change > 0 ? (
        <Span className="text-sm font-medium text-success tabular-nums">
          {t("widget.tender.changeHint", { amount: money(change) })}
        </Span>
      ) : null}
      <Button
        type="button"
        size="unset"
        className="h-14 w-full text-base font-semibold"
        disabled={busy || invalid}
        aria-label={t("widget.tender.take", { amount: money(capped) })}
        onClick={() => onTake(capped)}
      >
        {t("widget.tender.take", { amount: money(capped) })}
        <Kbd className="ml-3 hidden border-primary-foreground/30 bg-transparent text-primary-foreground/80 @lg:inline-flex">
          {t("widget.tender.shortcut")}
        </Kbd>
      </Button>
    </Div>
  );
}

export function VoidSaleButton({
  disabled,
  blocked,
  onConfirm,
}: {
  disabled: boolean;
  blocked: boolean;
  onConfirm: () => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          disabled={disabled || blocked}
          title={blocked ? t("widget.void.blocked") : undefined}
        >
          {t("widget.void.action")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("widget.void.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("widget.void.message")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("widget.void.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            {t("widget.void.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ReceiptPanel({
  order,
  onNewSale,
  onOpenReceipt,
  onRefund,
}: {
  order: RegisterOrder;
  onNewSale: () => void;
  onOpenReceipt: () => void;
  onRefund: () => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const money = (value: number): string =>
    formatPosSettlement(value, order.currency, locale);
  const change =
    order.payments.reduce((sum, payment) => sum + toUnits(payment.change), 0) /
    10_000;
  const methods = [
    ...new Set(
      order.payments.map((payment) => t(methodLabelKey(payment.method))),
    ),
  ].join(", ");

  return (
    <Div className="flex flex-col gap-4 px-4 py-5">
      <Div className="flex flex-col items-center gap-1 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" />
        <Span className="text-lg font-semibold">
          {t("widget.receipt.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("widget.receipt.number", { number: order.orderNumber })}
        </Span>
      </Div>
      {change > 0 ? (
        <Div className="flex flex-col items-center gap-0.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
          <Span className="text-sm font-medium text-success">
            {t("widget.receipt.giveChange")}
          </Span>
          <Span
            className="text-3xl font-bold tabular-nums text-success"
            data-testid="pos-register-change"
          >
            {money(change)}
          </Span>
        </Div>
      ) : null}
      <Div className="flex items-baseline justify-between text-sm">
        <Span className="text-muted-foreground">
          {t("widget.receipt.paidWith", { method: methods })}
        </Span>
        <Span className="text-xl font-semibold tabular-nums">
          {money(order.total)}
        </Span>
      </Div>
      <Button
        type="button"
        size="unset"
        className="h-14 w-full text-base font-semibold"
        onClick={onNewSale}
      >
        {t("widget.receipt.newSale")}
      </Button>
      <Div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={onOpenReceipt}>
          {t("widget.receipt.open")}
        </Button>
        <Button type="button" variant="outline" onClick={onRefund}>
          {t("widget.receipt.refund")}
        </Button>
      </Div>
    </Div>
  );
}
