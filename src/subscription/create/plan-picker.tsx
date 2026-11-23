"use client";

/**
 * The plan tiers as one picker: four cards (price + monthly credits), one
 * action below. Non-subscribers start the picked plan through checkout;
 * subscribers see their tier marked and move to another one in place
 * (PUT subscription/update) after a confirm that says what gets charged.
 * The bonus credits of higher tiers live only in their numbers; nothing here
 * advertises a percentage.
 *
 * Callers key it by the current tier + interval, so the picker reopens on
 * the right tier once the subscription has loaded.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowUp } from "next-vibe/ui/components/icons/ArrowUp";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getSubscriptionTiers,
  type SubscriptionTier,
  type SubscriptionTierProductId,
} from "@/products/repository-client";

import type { SubscriptionGetResponseOutput } from "../definition";
import { BillingInterval, type SubscriptionPlanValue } from "../enum";
import { scopedTranslation } from "../i18n";
import {
  getDefaultPickedTier,
  getTierChangeKind,
  type PlanOfferState,
  RECOMMENDED_TIER,
  type TierChangeKind,
} from "../plan-offers";
import updateDefinitions from "../update/definition";
import { refreshAfterTierChange } from "../update/refresh";
import { CreditExamples } from "./credit-examples";

export type PlanInterval =
  | typeof BillingInterval.MONTHLY
  | typeof BillingInterval.YEARLY;

interface PlanPickerProps {
  locale: CountryLanguage;
  state: PlanOfferState;
  subscription: SubscriptionGetResponseOutput | undefined;
  modelCount: number;
  /** Non-subscribers: open checkout for the picked plan. */
  onStart: (plan: typeof SubscriptionPlanValue, interval: PlanInterval) => void;
  /** Checkout is opening (keeps the button busy). */
  startPending: boolean;
  /** Checkout error to show under the action. */
  startError?: JSX.Element | null;
}

type ChangeResult =
  | { kind: "idle" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

export function PlanPicker({
  locale,
  state,
  subscription,
  modelCount,
  onStart,
  startPending,
  startError,
}: PlanPickerProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: productsT } = productsScopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const update = useApiMutation(updateDefinitions.PUT, logger, user);

  const tiers = getSubscriptionTiers(locale);
  const [picked, setPicked] = useState<SubscriptionTierProductId>(() =>
    getDefaultPickedTier(tiers, state.currentTier),
  );
  const [interval, setBillingInterval] = useState<PlanInterval>(
    state.currentInterval ?? BillingInterval.MONTHLY,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<ChangeResult>({ kind: "idle" });

  const tier = tiers.find((entry) => entry.productId === picked) ?? tiers[0];
  // Tiers sold yearly show the monthly / yearly toggle.
  const sellsYearly = tier.yearlyPrice !== null;
  const effectiveInterval: PlanInterval = sellsYearly
    ? interval
    : BillingInterval.MONTHLY;
  const isYearly = effectiveInterval === BillingInterval.YEARLY;
  const planName = productsT(tier.name);
  const priceLabel =
    isYearly && tier.yearlyPriceLabel ? tier.yearlyPriceLabel : tier.priceLabel;
  const periodLabel = isYearly ? t("tiers.perYear") : t("tiers.perMonth");

  const changeKind: TierChangeKind | null =
    state.currentTier && state.currentInterval
      ? getTierChangeKind({
          currentTier: state.currentTier,
          currentInterval: state.currentInterval,
          targetTier: tier.productId,
          targetInterval: effectiveInterval,
        })
      : null;

  const renewalDate = subscription?.currentPeriodEnd
    ? formatSimpleDate(new Date(subscription.currentPeriodEnd), locale)
    : "";
  const currentTierData = state.currentTier
    ? tiers.find((entry) => entry.productId === state.currentTier)
    : undefined;

  const applyChange = async (): Promise<void> => {
    setResult({ kind: "idle" });
    // mutateAsync resolves with the ErrorResponseType on failure
    const response = await update.mutateAsync({
      requestData: { plan: tier.planId, billingInterval: effectiveInterval },
    });
    setConfirmOpen(false);
    if (response.success) {
      setResult({ kind: "done", message: response.data.message });
      await refreshAfterTierChange(logger);
      return;
    }
    setResult({ kind: "error", message: response.message });
  };

  const yearlyMonthly =
    isYearly && tier.yearlyPrice !== null
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: tier.currency,
        }).format(tier.yearlyPrice / 12)
      : null;

  return (
    <Div data-testid="plan-picker" className="flex flex-col gap-4">
      <Div className="flex flex-col gap-0.5 px-1">
        <H3 className="m-0 text-lg font-semibold tracking-tight">
          {state.mode === "topUp"
            ? t("tiers.changeHeading")
            : t("tiers.heading")}
        </H3>
        <P className="m-0 text-sm text-muted-foreground">
          {state.mode === "topUp" && currentTierData
            ? t("tiers.changeSubheading", {
                plan: productsT(currentTierData.name),
                credits: currentTierData.creditsLabel,
              })
            : t("tiers.subheading", { modelCount })}
        </P>
      </Div>

      <Div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {tiers.map((entry) => (
          <TierCard
            key={entry.productId}
            tier={entry}
            name={productsT(entry.name)}
            selected={entry.productId === tier.productId}
            badge={
              entry.productId === state.currentTier
                ? { label: t("tiers.current"), tone: "current" }
                : !state.currentTier && entry.productId === RECOMMENDED_TIER
                  ? { label: t("tiers.recommended"), tone: "recommended" }
                  : null
            }
            perMonth={t("tiers.perMonth")}
            creditsUnit={t("tiers.creditsPerMonth")}
            onSelect={(): void => {
              setResult({ kind: "idle" });
              setPicked(entry.productId);
            }}
          />
        ))}
      </Div>

      {/* The action for the picked tier */}
      <Div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between md:gap-6">
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="flex min-w-0 flex-col gap-0.5">
            <Span className="text-base font-semibold leading-tight">
              {t("tiers.picked", {
                plan: planName,
                credits: tier.creditsLabel,
              })}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("tiers.pickedNote", { modelCount })}
            </Span>
          </Div>
          {sellsYearly && (
            <Div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Div className="inline-grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                {[BillingInterval.MONTHLY, BillingInterval.YEARLY].map(
                  (option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={
                        effectiveInterval === option ? "default" : "ghost"
                      }
                      aria-pressed={effectiveInterval === option}
                      onClick={(): void => {
                        setResult({ kind: "idle" });
                        setBillingInterval(option);
                      }}
                      className="h-8 px-4"
                    >
                      {option === BillingInterval.YEARLY
                        ? t("billing.yearly")
                        : t("billing.monthly")}
                    </Button>
                  ),
                )}
              </Div>
              {yearlyMonthly && (
                <Span className="text-sm font-medium text-success">
                  {t("tiers.yearlyEquivalent", { monthlyPrice: yearlyMonthly })}
                </Span>
              )}
            </Div>
          )}
        </Div>

        <Div className="flex shrink-0 flex-col gap-2 md:items-end">
          <Div className="flex items-baseline gap-1 md:justify-end">
            <Span className="text-3xl font-semibold tabular-nums tracking-tight">
              {priceLabel}
            </Span>
            <Span className="text-sm text-muted-foreground">{periodLabel}</Span>
          </Div>
          <PlanAction
            locale={locale}
            state={state}
            changeKind={changeKind}
            planName={planName}
            startPending={startPending}
            onStart={(): void => onStart(tier.planId, effectiveInterval)}
            onChange={(): void => setConfirmOpen(true)}
          />
        </Div>
      </Div>

      <CreditExamples
        locale={locale}
        monthlyCredits={tier.credits}
        creditsLabel={tier.creditsLabel}
      />

      {state.mode === "topUp" && !state.canSwitchTier && (
        <Div className="flex items-start gap-2 px-1 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <Span>{t("errors.tierChange.cryptoNotSupported")}</Span>
        </Div>
      )}
      {state.mode === "plans" && (
        <Div className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
          <Info className="mt-px h-3.5 w-3.5 shrink-0" />
          <Span>
            {t("quickCheckout.secure")} {t("tiers.cryptoHint")}
          </Span>
        </Div>
      )}
      {startError}
      {result.kind === "done" && (
        <Div
          aria-live="polite"
          data-testid="plan-change-result"
          className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm"
        >
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <Span>{result.message}</Span>
        </Div>
      )}
      {result.kind === "error" && (
        <Div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <Span className="break-words">{result.message}</Span>
        </Div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {changeKind === "upgrade"
                ? t("tiers.confirm.upgradeTitle", { plan: planName })
                : changeKind === "downgrade"
                  ? t("tiers.confirm.downgradeTitle", { plan: planName })
                  : t("tiers.confirm.intervalTitle")}
            </DialogTitle>
            <DialogDescription>
              {changeKind === "upgrade"
                ? t("tiers.confirm.upgradeBody", {
                    price: tier.priceLabel,
                    credits: tier.creditsLabel,
                  })
                : changeKind === "downgrade"
                  ? t("tiers.confirm.downgradeBody", {
                      date: renewalDate,
                      price: tier.priceLabel,
                      credits: tier.creditsLabel,
                    })
                  : t("tiers.confirm.intervalBody", {
                      plan: planName,
                      price: priceLabel,
                      period: periodLabel,
                      credits: tier.creditsLabel,
                    })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={update.isPending}
              onClick={(): void => setConfirmOpen(false)}
            >
              {t("tiers.confirm.cancel")}
            </Button>
            <Button
              type="button"
              data-testid="plan-change-confirm"
              disabled={update.isPending}
              onClick={(): void => {
                void applyChange();
              }}
            >
              {update.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("tiers.confirm.working")}
                </>
              ) : changeKind === "upgrade" ? (
                t("tiers.confirm.upgradeButton")
              ) : changeKind === "downgrade" ? (
                t("tiers.confirm.downgradeButton")
              ) : (
                t("tiers.confirm.intervalButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Div>
  );
}

interface TierCardProps {
  tier: SubscriptionTier;
  name: string;
  selected: boolean;
  badge: { label: string; tone: "current" | "recommended" } | null;
  perMonth: string;
  creditsUnit: string;
  onSelect: () => void;
}

/** One tier: name, price, monthly credits. The whole card is the tap target. */
function TierCard({
  tier,
  name,
  selected,
  badge,
  perMonth,
  creditsUnit,
  onSelect,
}: TierCardProps): JSX.Element {
  return (
    <Button
      type="button"
      variant="outline"
      size="unset"
      aria-pressed={selected}
      data-testid={`plan-tier-${tier.productId}`}
      onClick={onSelect}
      className={cn(
        "relative h-auto w-full flex-col items-stretch justify-start gap-3 whitespace-normal rounded-xl bg-card p-3.5 text-left font-normal shadow-sm transition-all sm:p-4",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/40 hover:bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/40",
      )}
    >
      <Span className="flex min-h-6 items-center justify-between gap-2">
        <Span className="text-sm font-semibold text-foreground">{name}</Span>
        <Span
          aria-hidden
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/40",
          )}
        >
          {selected && (
            <Span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          )}
        </Span>
      </Span>
      <Span className="flex items-baseline gap-1">
        <Span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
          {tier.priceLabel}
        </Span>
        <Span className="text-xs text-muted-foreground">{perMonth}</Span>
      </Span>
      <Span className="flex flex-col border-t border-border/60 pt-2.5">
        <Span className="text-base font-semibold tabular-nums text-primary">
          {tier.creditsLabel}
        </Span>
        <Span className="text-xs text-muted-foreground">{creditsUnit}</Span>
      </Span>
      {badge && (
        <Badge
          variant={badge.tone === "current" ? "secondary" : "default"}
          className="absolute -top-2.5 left-3 px-2 py-0 text-[11px] font-semibold"
        >
          {badge.label}
        </Badge>
      )}
    </Button>
  );
}

interface PlanActionProps {
  locale: CountryLanguage;
  state: PlanOfferState;
  changeKind: TierChangeKind | null;
  planName: string;
  startPending: boolean;
  onStart: () => void;
  onChange: () => void;
}

/** The one button under the picker, per viewer state. */
function PlanAction({
  locale,
  state,
  changeKind,
  planName,
  startPending,
  onStart,
  onChange,
}: PlanActionProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const buttonClass = "h-11 w-full md:w-auto md:min-w-48";

  if (state.mode === "guest") {
    return (
      <Div className="flex flex-col gap-2 md:items-end">
        <Span className="text-xs text-muted-foreground">
          {t("tiers.signInHint")}
        </Span>
        <Div className="flex w-full gap-2 md:w-auto">
          <Button variant="outline" asChild className="h-11 flex-1">
            <Link href={`/${locale}/user/login`}>{t("buy.login")}</Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href={`/${locale}/user/signup`}>{t("buy.signup")}</Link>
          </Button>
        </Div>
      </Div>
    );
  }

  if (state.mode === "plans") {
    return (
      <Button
        type="button"
        size="lg"
        data-testid="plan-start"
        disabled={startPending}
        onClick={onStart}
        className={buttonClass}
      >
        {startPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("tiers.cta.start", { plan: planName })}
      </Button>
    );
  }

  if (changeKind === "current" || changeKind === null) {
    return (
      <Div className="flex h-11 items-center justify-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 text-sm font-medium md:justify-end">
        <CheckCircle className="h-4 w-4 text-success" />
        {t("tiers.cta.current")}
      </Div>
    );
  }

  const label =
    changeKind === "upgrade"
      ? t("tiers.cta.upgrade", { plan: planName })
      : changeKind === "downgrade"
        ? t("tiers.cta.downgrade", { plan: planName })
        : state.currentInterval === BillingInterval.MONTHLY
          ? t("tiers.cta.intervalYearly")
          : t("tiers.cta.intervalMonthly", { plan: planName });

  return (
    <Button
      type="button"
      size="lg"
      variant={changeKind === "upgrade" ? "default" : "outline"}
      data-testid="plan-change"
      disabled={!state.canSwitchTier}
      onClick={onChange}
      className={buttonClass}
    >
      {changeKind === "upgrade" && <ArrowUp className="h-4 w-4" />}
      {label}
    </Button>
  );
}
