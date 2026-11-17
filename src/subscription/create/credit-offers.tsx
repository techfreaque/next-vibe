"use client";

/**
 * The two ways to get credits right now, with real prices from the product
 * config: a one-time pack and the monthly plan. One tap opens card checkout
 * (Stripe). Crypto needs a yearly plan or 2500+ credits, so it lives on the
 * full buy page, linked below the tiles.
 *
 * Used where a signed-in user runs dry: the chat's out-of-credits card and the
 * credits header on the subscription pages. Guests never see this (both
 * checkouts need an account).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { assignUrl } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import type { JSX } from "react";
import { useState } from "react";

import purchaseDefinitions from "@/credits/purchase/definition";
import { PaymentProvider } from "@/payment/enum";
import { getPricingParams, ProductIds } from "@/products/repository-client";

import { BillingInterval, SubscriptionPlan } from "../enum";
import { scopedTranslation } from "../i18n";
import subscriptionCreateDefinitions from "./definition";

type Pending = "pack" | "plan" | null;

interface CreditOffersProps {
  locale: CountryLanguage;
  /** Already on the plan: only the pack makes sense. */
  hasSubscription: boolean;
  /** Tiles side by side from this container width up. */
  className?: string;
}

export function CreditOffers({
  locale,
  hasSubscription,
  className,
}: CreditOffersProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const packCheckout = useApiMutation(purchaseDefinitions.POST, logger, user);
  const planCheckout = useApiMutation(
    subscriptionCreateDefinitions.POST,
    logger,
    user,
  );
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);

  if (user.isPublic) {
    return null;
  }

  const pricing = getPricingParams(locale);

  const openCheckout = async (offer: "pack" | "plan"): Promise<void> => {
    setError(null);
    setPending(offer);
    // mutateAsync resolves with the ErrorResponseType on failure
    const result =
      offer === "pack"
        ? await packCheckout.mutateAsync({
            requestData: {
              quantity: 1,
              productId: ProductIds.CREDIT_PACK,
              provider: PaymentProvider.STRIPE,
            },
          })
        : await planCheckout.mutateAsync({
            requestData: {
              plan: SubscriptionPlan.SUBSCRIPTION,
              billingInterval: BillingInterval.MONTHLY,
              provider: PaymentProvider.STRIPE,
            },
          });
    if (result.success && result.data.checkoutUrl) {
      // Keep the spinner up while the browser leaves for checkout.
      assignUrl(result.data.checkoutUrl);
      return;
    }
    setPending(null);
    setError(result.success ? t("quickCheckout.error") : result.message);
  };

  const busy = pending !== null;

  return (
    <Div
      data-testid="credit-offers"
      className={cn("@container/offers flex flex-col gap-2", className)}
    >
      <Div
        className={cn(
          "grid grid-cols-1 gap-2",
          !hasSubscription && "@md/offers:grid-cols-2",
        )}
      >
        <OfferTile
          testId="credit-offer-pack"
          icon={<Coins className="h-4 w-4" />}
          title={t("quickCheckout.pack.title", {
            credits: pricing.packCredits,
          })}
          note={t("quickCheckout.pack.note")}
          price={pricing.packPrice}
          priceSuffix={null}
          loadingLabel={t("quickCheckout.opening")}
          loading={pending === "pack"}
          disabled={busy}
          ariaLabel={t("quickCheckout.pack.aria", {
            credits: pricing.packCredits,
            price: pricing.packPrice,
          })}
          onSelect={(): void => {
            void openCheckout("pack");
          }}
        />
        {!hasSubscription && (
          <OfferTile
            testId="credit-offer-plan"
            icon={<RefreshCw className="h-4 w-4" />}
            title={t("quickCheckout.plan.title", {
              credits: pricing.subscriptionCredits,
            })}
            note={t("quickCheckout.plan.note")}
            price={pricing.subscriptionPrice}
            priceSuffix={t("quickCheckout.plan.perMonth")}
            loadingLabel={t("quickCheckout.opening")}
            loading={pending === "plan"}
            disabled={busy}
            ariaLabel={t("quickCheckout.plan.aria", {
              credits: pricing.subscriptionCredits,
              price: pricing.subscriptionPrice,
            })}
            onSelect={(): void => {
              void openCheckout("plan");
            }}
          />
        )}
      </Div>
      {error && (
        <Div
          role="alert"
          className="flex items-start gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
          <Span>{error}</Span>
        </Div>
      )}
      <Div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Span>{t("quickCheckout.secure")}</Span>
        <Link
          href={`/${locale}/subscription/buy`}
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
        >
          {t("quickCheckout.moreOptions")}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Div>
    </Div>
  );
}

interface OfferTileProps {
  testId: string;
  icon: JSX.Element;
  title: string;
  note: string;
  price: string;
  priceSuffix: string | null;
  loadingLabel: string;
  loading: boolean;
  disabled: boolean;
  ariaLabel: string;
  onSelect: () => void;
}

/** One offer: what you get on the left, the price as the tap target's end. */
function OfferTile({
  testId,
  icon,
  title,
  note,
  price,
  priceSuffix,
  loadingLabel,
  loading,
  disabled,
  ariaLabel,
  onSelect,
}: OfferTileProps): JSX.Element {
  return (
    <Button
      type="button"
      variant="outline"
      size="unset"
      data-testid={testId}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onSelect}
      className="group h-auto min-h-14 w-full justify-between gap-3 rounded-xl border-border bg-background px-3 py-2.5 text-left font-normal transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-70"
    >
      <Span className="flex min-w-0 items-center gap-2.5">
        <Span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        </Span>
        <Span className="flex min-w-0 flex-col">
          <Span className="truncate text-sm font-semibold leading-tight text-foreground">
            {title}
          </Span>
          <Span className="text-xs leading-snug text-muted-foreground">
            {loading ? loadingLabel : note}
          </Span>
        </Span>
      </Span>
      <Span className="flex flex-shrink-0 items-baseline gap-0.5 rounded-lg bg-primary px-2.5 py-1.5 text-sm font-semibold tabular-nums text-primary-foreground transition-colors group-hover:bg-primary/90">
        {price}
        {priceSuffix && (
          <Span className="text-xs font-medium opacity-80">{priceSuffix}</Span>
        )}
      </Span>
    </Button>
  );
}
