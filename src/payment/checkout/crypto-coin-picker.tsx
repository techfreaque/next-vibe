/**
 * Crypto option of the buy dialogs (plans and credit packs).
 *
 * With live coin minimums it lists only the coins that accept the amount, so
 * the buyer never lands on a NOWPayments page that stalls on a too-small coin;
 * the pick goes to checkout as `payCurrency`. Without minimums (API down) or
 * with NOWPayments card payments on, it is one button to the hosted page.
 */

"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Bitcoin } from "next-vibe/ui/components/icons/Bitcoin";
import { Info } from "next-vibe/ui/components/icons/Info";
import type { JSX } from "react";

import {
  cryptoAcceptsAmount,
  type CryptoCoinMinimum,
  type CryptoCoinValue,
  eligibleCryptoCoins,
} from "./crypto-coins";
import { scopedTranslation } from "./i18n";

interface CryptoCoinPickerProps {
  /** US list price of what is being bought (see cryptoAmountUsd). */
  amountUsd: number;
  /** Live minimums from GET /subscription; undefined while unknown. */
  coins: CryptoCoinMinimum[] | undefined;
  /** NOWPayments takes cards too: one hosted-page button, no coin list. */
  acceptsCards: boolean;
  title: string;
  description: string;
  /** Shown instead of coins when no coin accepts the amount. */
  belowMinimumNotice: string;
  onSelect: (payCurrency: typeof CryptoCoinValue | undefined) => void;
}

export function CryptoCoinPicker({
  amountUsd,
  coins,
  acceptsCards,
  title,
  description,
  belowMinimumNotice,
  onSelect,
}: CryptoCoinPickerProps): JSX.Element {
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  const eligible = coins ? eligibleCryptoCoins(coins, amountUsd) : [];
  // Same floor as the server guard: no coin (or, while minimums are unknown,
  // the fallback floor) accepts the amount.
  const blocked = !acceptsCards && !cryptoAcceptsAmount(coins, amountUsd);
  const showCoins = !acceptsCards && eligible.length > 0;

  const heading = (
    <>
      <Bitcoin className="h-6 w-6 shrink-0 text-orange-500 mr-3" />
      <Div className="min-w-0 text-left">
        <Div className="font-semibold">{title}</Div>
        <Div className="text-sm text-muted-foreground">{description}</Div>
      </Div>
    </>
  );

  return (
    <Div className="grid gap-3" data-testid="crypto-checkout-option">
      {showCoins ? (
        <Div className="grid gap-3 rounded-md border border-input p-4">
          <Div className="flex items-start">{heading}</Div>
          <Div className="text-sm font-medium">
            {t("availability.cryptoPickCoin")}
          </Div>
          <Div className="grid grid-cols-2 gap-2">
            {eligible.map(({ coin }) => (
              <Button
                key={coin}
                type="button"
                variant="outline"
                size="sm"
                className="h-auto min-h-9 min-w-0 justify-start whitespace-normal py-2 text-left"
                data-testid="crypto-coin-option"
                onClick={() => onSelect(coin)}
              >
                {t(coin)}
              </Button>
            ))}
          </Div>
        </Div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-auto p-4 justify-start whitespace-normal"
          onClick={() => onSelect(undefined)}
          disabled={blocked}
        >
          {heading}
        </Button>
      )}
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
