/**
 * Crypto option of the buy dialogs (plans and credit packs).
 *
 * One button to the NOWPayments invoice page, where the buyer picks any coin.
 * Switched off with a notice only when the amount is below what every coin
 * accepts (same floor as the server guard). With NOWPayments card payments on
 * no coin floor applies.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Bitcoin } from "next-vibe/ui/components/icons/Bitcoin";
import { Info } from "next-vibe/ui/components/icons/Info";
import type { JSX } from "react";

import { cryptoAcceptsAmount } from "./crypto-coins";

interface CryptoCheckoutOptionProps {
  /** US list price of what is being bought (see cryptoAmountUsd). */
  amountUsd: number;
  /** Crypto floor in USD (see cryptoMinimumUsd). */
  minimumUsd: number;
  /** NOWPayments takes cards too: no coin floor. */
  acceptsCards: boolean;
  title: string;
  description: string;
  /** Shown when no coin accepts the amount. */
  belowMinimumNotice: string;
  onSelect: () => void;
}

export function CryptoCheckoutOption({
  amountUsd,
  minimumUsd,
  acceptsCards,
  title,
  description,
  belowMinimumNotice,
  onSelect,
}: CryptoCheckoutOptionProps): JSX.Element {
  const blocked = !acceptsCards && !cryptoAcceptsAmount(minimumUsd, amountUsd);

  return (
    <Div className="grid gap-3" data-testid="crypto-checkout-option">
      <Button
        type="button"
        variant="outline"
        className="h-auto p-4 justify-start whitespace-normal"
        onClick={onSelect}
        disabled={blocked}
      >
        <Bitcoin className="h-6 w-6 shrink-0 text-orange-500 mr-3" />
        <Div className="min-w-0 text-left">
          <Div className="font-semibold">{title}</Div>
          <Div className="text-sm text-muted-foreground">{description}</Div>
        </Div>
      </Button>
      {blocked && (
        <Div
          data-testid="crypto-below-minimum"
          className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/15 p-3 text-sm text-warning"
        >
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          {belowMinimumNotice}
        </Div>
      )}
    </Div>
  );
}
