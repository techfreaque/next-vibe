"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Bitcoin } from "next-vibe/ui/components/icons/Bitcoin";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Link } from "next-vibe/ui/components/link";
import { assignUrl } from "next-vibe/ui/lib/location";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

interface SubscriptionPastDueNoticeProps {
  locale: CountryLanguage;
  /** Last day the plan stays live while Stripe retries. */
  gracePeriodEndsAt: string | undefined;
  /** Stripe-hosted page of the failed invoice (approve 3DS / e-mandate, or pay with another card). */
  retryPaymentUrl: string | undefined;
  /** ISO country of the card on file (from Stripe, not IP). */
  cardCountry: string | undefined;
  /** Fallback when no open invoice page is known: the provider's billing portal. */
  onUpdatePaymentMethod: () => void | Promise<void>;
}

/**
 * Shown while a card plan is PAST_DUE: what happened, why banks hold such
 * charges (3DS, Indian e-mandates), and three ways out: approve or retry the
 * charge, top up with a one-time pack (allowed during the grace period), or
 * pay with crypto.
 */
export function SubscriptionPastDueNotice({
  locale,
  gracePeriodEndsAt,
  retryPaymentUrl,
  cardCountry,
  onUpdatePaymentMethod,
}: SubscriptionPastDueNoticeProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const buyPath = `/${locale}/subscription/buy`;

  const handleRetry = async (): Promise<void> => {
    if (retryPaymentUrl) {
      assignUrl(retryPaymentUrl);
      return;
    }
    await onUpdatePaymentMethod();
  };

  return (
    <Div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/30">
      <Div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <Div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          <Div className="font-semibold text-warning">{t("pastDue.title")}</Div>
          {gracePeriodEndsAt && (
            <Div>
              {t("pastDue.description", {
                date: formatSimpleDate(new Date(gracePeriodEndsAt), locale),
              })}
            </Div>
          )}
          <Div className="text-muted-foreground">{t("pastDue.reason")}</Div>
          {cardCountry === "IN" && (
            <Div className="text-muted-foreground">
              {t("pastDue.indiaMandate")}
            </Div>
          )}
          <Div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              onClick={handleRetry}
              size="sm"
              className="h-auto min-h-9 whitespace-normal"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("pastDue.retry")}
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto min-h-9 whitespace-normal"
            >
              <Link href={buyPath}>
                <Coins className="h-4 w-4 mr-2" />
                {t("pastDue.buyPack")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto min-h-9 whitespace-normal"
            >
              <Link href={buyPath}>
                <Bitcoin className="h-4 w-4 mr-2 text-orange-500" />
                {t("pastDue.payCrypto")}
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
