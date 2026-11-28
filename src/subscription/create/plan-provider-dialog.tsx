/**
 * Payment-method choice for a plan purchase (Card, Crypto).
 *
 * Shared by the buy page and the "Move my plan" card, so both offer the same
 * choice with the same availability rules. `allowStripe=false` hides the old
 * Stripe card option (the switch never goes back to it).
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Info } from "next-vibe/ui/components/icons/Info";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { CryptoCheckoutOption } from "@/payment/checkout/crypto-checkout-option";
import { scopedTranslation as checkoutScopedTranslation } from "@/payment/checkout/i18n";
import { PaymentProvider, type PaymentProviderValue } from "@/payment/enum";
import { resolveCardCheckoutProvider } from "@/payment/providers/card-provider";

import { scopedTranslation } from "../i18n";

interface PlanProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: CountryLanguage;
  /** Providers open for new checkouts; undefined = unknown (all offered). */
  checkoutProviders: readonly (typeof PaymentProviderValue)[] | undefined;
  nowPaymentsAcceptsCards: boolean;
  cryptoMinUsd: number;
  /** US list price of the plan being bought (crypto floor check). */
  amountUsd: number;
  allowStripe?: boolean;
  onSelect: (provider: typeof PaymentProviderValue) => void;
}

export function PlanProviderDialog({
  open,
  onOpenChange,
  locale,
  checkoutProviders,
  nowPaymentsAcceptsCards,
  cryptoMinUsd,
  amountUsd,
  allowStripe = true,
  onSelect,
}: PlanProviderDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: tCheckout } = checkoutScopedTranslation.scopedT(locale);

  const cardProvider = resolveCardCheckoutProvider(checkoutProviders);
  const whopAvailable =
    checkoutProviders?.includes(PaymentProvider.WHOP) === true;
  const cryptoAvailable =
    checkoutProviders === undefined ||
    checkoutProviders.includes(PaymentProvider.NOWPAYMENTS);
  const isCardCheckoutPaused = allowStripe
    ? cardProvider === null
    : !whopAvailable;
  const showStripeOption =
    allowStripe && (cardProvider === PaymentProvider.STRIPE || !whopAvailable);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("checkout.form.fields.provider.label")}</DialogTitle>
          <DialogDescription>
            {t("checkout.form.fields.provider.description")}
          </DialogDescription>
        </DialogHeader>
        <Div className="grid gap-4 py-4">
          {isCardCheckoutPaused && (
            <Div
              data-testid="card-checkout-paused"
              className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/15 p-3 text-sm text-warning"
            >
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              {tCheckout("availability.cardPaused")}
            </Div>
          )}
          {whopAvailable && (
            <Button
              type="button"
              variant="outline"
              data-testid="whop-card-option"
              className="h-auto p-4 justify-start whitespace-normal"
              onClick={() => onSelect(PaymentProvider.WHOP)}
            >
              <CreditCard className="h-6 w-6 text-primary mr-3" />
              <Div className="min-w-0 text-left">
                <Div className="font-semibold">
                  {tCheckout("availability.whopCardLabel")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {tCheckout("availability.whopCardDescription")}
                </Div>
              </Div>
            </Button>
          )}
          {showStripeOption && (
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-auto p-4 justify-start whitespace-normal",
                isCardCheckoutPaused && "order-last",
              )}
              onClick={() => onSelect(PaymentProvider.STRIPE)}
              disabled={isCardCheckoutPaused}
            >
              <CreditCard className="h-6 w-6 text-primary mr-3" />
              <Div className="min-w-0 text-left">
                <Div className="font-semibold">{t("buy.provider.stripe")}</Div>
                <Div className="text-sm text-muted-foreground">
                  {t("buy.provider.stripeDescription")}
                </Div>
              </Div>
            </Button>
          )}
          {cryptoAvailable && (
            <CryptoCheckoutOption
              amountUsd={amountUsd}
              minimumUsd={cryptoMinUsd}
              acceptsCards={nowPaymentsAcceptsCards}
              title={
                nowPaymentsAcceptsCards
                  ? tCheckout("availability.nowpaymentsCardLabel")
                  : t("buy.provider.nowpayments")
              }
              description={
                nowPaymentsAcceptsCards
                  ? tCheckout("availability.nowpaymentsCardDescription")
                  : t("buy.provider.nowpaymentsDescription")
              }
              belowMinimumNotice={t("buy.provider.cryptoAmountTooLow")}
              onSelect={() => onSelect(PaymentProvider.NOWPAYMENTS)}
            />
          )}
        </Div>
      </DialogContent>
    </Dialog>
  );
}
