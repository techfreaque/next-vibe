"use client";

/**
 * The fastest way to more credits, with real prices from the product config.
 * Packs top up a plan (Max, 2026-11-17), so what shows depends on the viewer:
 * - No live plan: the cheapest plans, one tap to card checkout (Stripe), and
 *   a link to every plan on the buy page.
 * - Live plan: a pack (one tap to checkout) and the next tier up, switched in
 *   place after an inline confirm (it charges the prorated difference).
 * Crypto (coin picked on the NOWPayments page, small amounts switched off)
 * lives on the buy page.
 *
 * Used where a signed-in user runs dry: the chat's out-of-credits card and the
 * credits header on the subscription pages. Guests never see this (every
 * checkout needs an account).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { ArrowUp } from "next-vibe/ui/components/icons/ArrowUp";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
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
import { resolveCardCheckoutProvider } from "@/payment/providers/card-provider";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getPricingParams,
  getSubscriptionTiers,
  ProductIds,
  type SubscriptionTier,
  type SubscriptionTierProductId,
} from "@/products/repository-client";

import { BillingInterval } from "../enum";
import { useSubscription } from "../hooks";
import { scopedTranslation } from "../i18n";
import {
  getCompactTiers,
  getPlanOfferState,
  getUpgradeTier,
} from "../plan-offers";
import updateDefinitions from "../update/definition";
import { refreshAfterTierChange } from "../update/refresh";
import subscriptionCreateDefinitions from "./definition";

type Pending = "pack" | "upgrade" | SubscriptionTierProductId | null;

type Notice =
  | { kind: "none" }
  | { kind: "error"; message: string }
  | { kind: "done"; message: string };

interface CreditOffersProps {
  locale: CountryLanguage;
  /** Tiles side by side from this container width up. */
  className?: string;
}

export function CreditOffers({
  locale,
  className,
}: CreditOffersProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: productsT } = productsScopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const subscriptionRead = useSubscription(logger, user).read;
  const packCheckout = useApiMutation(purchaseDefinitions.POST, logger, user);
  const planCheckout = useApiMutation(
    subscriptionCreateDefinitions.POST,
    logger,
    user,
  );
  const tierChange = useApiMutation(updateDefinitions.PUT, logger, user);
  const [pending, setPending] = useState<Pending>(null);
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);
  const [notice, setNotice] = useState<Notice>({ kind: "none" });

  if (user.isPublic) {
    return null;
  }
  // Until the plan is known, showing either set would flip under the finger.
  if (subscriptionRead?.isLoading && !subscriptionRead.data) {
    return (
      <Div
        data-testid="credit-offers-loading"
        className={cn("flex h-14 items-center justify-center", className)}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const state = getPlanOfferState({
    isPublic: false,
    subscription: subscriptionRead?.data,
  });
  const pricing = getPricingParams(locale);
  const tiers = getSubscriptionTiers(locale);
  const upgradeTier =
    state.mode === "topUp" && state.currentTier && state.canSwitchTier
      ? getUpgradeTier(tiers, state.currentTier)
      : null;

  const leaveForCheckout = <TData extends { checkoutUrl?: string }>(
    result: ResponseType<TData>,
  ): void => {
    if (result.success && result.data.checkoutUrl) {
      // Keep the spinner up while the browser leaves for checkout.
      assignUrl(result.data.checkoutUrl);
      return;
    }
    setPending(null);
    setNotice({
      kind: "error",
      message: result.success ? t("quickCheckout.error") : result.message,
    });
  };

  // Card checkout paused (e.g. Stripe account on hold): the quick tiles open
  // the buy page, which offers the providers that still work.
  // Whop takes over the quick card checkout while Stripe is paused.
  const cardProvider = resolveCardCheckoutProvider(
    subscriptionRead?.data?.checkoutProviders,
  );
  const cardCheckoutPaused = cardProvider === null;
  const openBuyPage = (pendingKey: Pending): void => {
    setPending(pendingKey);
    assignUrl(`/${locale}/subscription/buy`);
  };

  const buyPack = async (): Promise<void> => {
    setNotice({ kind: "none" });
    if (cardCheckoutPaused) {
      openBuyPage("pack");
      return;
    }
    setPending("pack");
    // mutateAsync resolves with the ErrorResponseType on failure
    leaveForCheckout(
      await packCheckout.mutateAsync({
        requestData: {
          quantity: 1,
          productId: ProductIds.CREDIT_PACK,
          provider: cardProvider ?? PaymentProvider.STRIPE,
        },
      }),
    );
  };

  const startPlan = async (tier: SubscriptionTier): Promise<void> => {
    setNotice({ kind: "none" });
    if (cardCheckoutPaused) {
      openBuyPage(tier.productId);
      return;
    }
    setPending(tier.productId);
    leaveForCheckout(
      await planCheckout.mutateAsync({
        requestData: {
          plan: tier.planId,
          billingInterval: BillingInterval.MONTHLY,
          provider: cardProvider ?? PaymentProvider.STRIPE,
        },
      }),
    );
  };

  const upgrade = async (tier: SubscriptionTier): Promise<void> => {
    setNotice({ kind: "none" });
    setPending("upgrade");
    const result = await tierChange.mutateAsync({
      requestData: {
        plan: tier.planId,
        billingInterval: BillingInterval.MONTHLY,
      },
    });
    setPending(null);
    setConfirmUpgrade(false);
    if (result.success) {
      setNotice({ kind: "done", message: result.data.message });
      await refreshAfterTierChange(logger);
      return;
    }
    setNotice({ kind: "error", message: result.message });
  };

  const busy = pending !== null;

  const tiles: JSX.Element[] =
    state.mode === "topUp"
      ? [
          <OfferTile
            key="pack"
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
              void buyPack();
            }}
          />,
          ...(upgradeTier
            ? [
                <OfferTile
                  key="upgrade"
                  testId="credit-offer-upgrade"
                  icon={<ArrowUp className="h-4 w-4" />}
                  title={t("quickCheckout.upgrade.title", {
                    plan: productsT(upgradeTier.name),
                  })}
                  note={t("quickCheckout.upgrade.note", {
                    credits: upgradeTier.creditsLabel,
                  })}
                  price={upgradeTier.priceLabel}
                  priceSuffix={t("quickCheckout.plan.perMonth")}
                  loadingLabel={t("quickCheckout.upgrade.working")}
                  loading={pending === "upgrade"}
                  disabled={busy}
                  selected={confirmUpgrade}
                  ariaLabel={t("quickCheckout.upgrade.aria", {
                    plan: productsT(upgradeTier.name),
                    credits: upgradeTier.creditsLabel,
                    price: upgradeTier.priceLabel,
                  })}
                  onSelect={(): void => {
                    setNotice({ kind: "none" });
                    setConfirmUpgrade((open) => !open);
                  }}
                />,
              ]
            : []),
        ]
      : getCompactTiers(tiers).map((tier) => (
          <OfferTile
            key={tier.productId}
            testId={`credit-offer-tier-${tier.productId}`}
            icon={<RefreshCw className="h-4 w-4" />}
            title={t("quickCheckout.plan.title", {
              credits: tier.creditsLabel,
            })}
            note={t("quickCheckout.plan.note", {
              plan: productsT(tier.name),
            })}
            price={tier.priceLabel}
            priceSuffix={t("quickCheckout.plan.perMonth")}
            loadingLabel={t("quickCheckout.opening")}
            loading={pending === tier.productId}
            disabled={busy}
            ariaLabel={t("quickCheckout.plan.aria", {
              plan: productsT(tier.name),
              credits: tier.creditsLabel,
              price: tier.priceLabel,
            })}
            onSelect={(): void => {
              void startPlan(tier);
            }}
          />
        ));

  return (
    <Div
      data-testid="credit-offers"
      className={cn("@container/offers flex flex-col gap-2", className)}
    >
      <Div
        className={cn(
          "grid grid-cols-1 gap-2",
          tiles.length > 1 && "@md/offers:grid-cols-2",
        )}
      >
        {tiles}
      </Div>
      {confirmUpgrade && upgradeTier && (
        <Div
          data-testid="credit-offer-upgrade-confirm"
          className="flex flex-col gap-2.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 @md/offers:flex-row @md/offers:items-center @md/offers:justify-between"
        >
          <Span className="text-xs leading-snug text-foreground">
            {t("quickCheckout.upgrade.confirm")}
          </Span>
          <Div className="flex shrink-0 gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={(): void => setConfirmUpgrade(false)}
            >
              {t("quickCheckout.upgrade.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              data-testid="credit-offer-upgrade-go"
              disabled={busy}
              onClick={(): void => {
                void upgrade(upgradeTier);
              }}
            >
              {pending === "upgrade" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {t("quickCheckout.upgrade.confirmButton")}
            </Button>
          </Div>
        </Div>
      )}
      {notice.kind === "error" && (
        <Div
          role="alert"
          className="flex items-start gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
          <Span className="break-words">{notice.message}</Span>
        </Div>
      )}
      {notice.kind === "done" && (
        <Div
          aria-live="polite"
          className="flex items-start gap-1.5 text-xs text-success"
        >
          <CheckCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
          <Span>{notice.message}</Span>
        </Div>
      )}
      <Div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Span>{t("quickCheckout.secure")}</Span>
        <Link
          href={`/${locale}/subscription/buy`}
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
        >
          {state.mode === "topUp"
            ? t("quickCheckout.moreOptions")
            : t("quickCheckout.allPlans")}
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
  /** Tile is the open step of a two-step action (upgrade confirm). */
  selected?: boolean;
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
  selected = false,
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
      aria-expanded={selected || undefined}
      onClick={onSelect}
      className={cn(
        "group h-auto min-h-14 w-full justify-between gap-3 rounded-xl bg-background px-3 py-2.5 text-left font-normal transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-70",
        selected ? "border-primary/60 bg-primary/5" : "border-border",
      )}
    >
      <Span className="flex min-w-0 items-center gap-2.5">
        <Span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        </Span>
        <Span className="flex min-w-0 flex-col">
          <Span className="truncate text-sm font-semibold leading-tight text-foreground">
            {title}
          </Span>
          <Span className="truncate text-xs leading-snug text-muted-foreground">
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
