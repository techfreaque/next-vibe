"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Smartphone } from "next-vibe/ui/components/icons/Smartphone";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

interface CheckoutCardTipProps {
  locale: CountryLanguage;
  /** ISO country of the card that failed (from Stripe, not IP). */
  cardCountry: string | undefined;
}

/**
 * Guidance after a card checkout failed its 3D Secure / OTP step: approve the
 * code in the bank app and keep the tab open, the Indian "international
 * online payments" switch when the card is Indian, and the fallback (another
 * card or crypto, both offered in the payment dialog).
 */
export function CheckoutCardTip({
  locale,
  cardCountry,
}: CheckoutCardTipProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div
      role="note"
      data-testid="checkout-card-tip"
      className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3.5 text-sm"
    >
      <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <Div className="flex flex-col gap-1">
        <Div className="font-semibold">{t("checkoutTip.title")}</Div>
        <Div>{t("checkoutTip.body")}</Div>
        {cardCountry === "IN" && (
          <Div className="text-muted-foreground">{t("checkoutTip.india")}</Div>
        )}
        <Div className="text-muted-foreground">{t("checkoutTip.other")}</Div>
      </Div>
    </Div>
  );
}
