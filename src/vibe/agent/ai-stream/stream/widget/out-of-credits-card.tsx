"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation as frameworkMessages } from "next-vibe/core/i18n/shared";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { X } from "next-vibe/ui/components/icons/X";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { usePathname } from "next-vibe/ui/hooks/use-navigation";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useState } from "react";

import type { CreditPolicyReason } from "@/credits/anti-farming/reason";
import { FreeCreditsStatus } from "@/credits/enum";
import { useCreditsTotal, useFreeCreditsStatus } from "@/credits/hooks";
import { scopedTranslation as creditMessages } from "@/credits/i18n";
import { NewsletterCreditOffer } from "@/newsletter/credit-bonus/enum";
import { useNewsletterCreditBonus } from "@/newsletter/credit-bonus/hooks";
import { formatCreditAmount } from "@/products/credit-money";
import { getPricingParams } from "@/products/repository-client";
import { CreditOffers } from "@/subscription/create/credit-offers";
import { useSubscription } from "@/subscription/hooks";
import { isLivePlan } from "@/subscription/plan-offers";
import { VerifyEmailCreditsPrompt } from "@/user/public/verify-email/credits-prompt";

import { scopedTranslation } from "../i18n";

interface OutOfCreditsCardProps {
  locale: CountryLanguage;
  /** Guests: sign up / log in. Members: top up, refill date, newsletter bonus. */
  isGuest: boolean;
  reason?: CreditPolicyReason;
  /** Shows a close button (composer placement). */
  onDismiss?: () => void;
  /**
   * "composer": rendered inside the chat input's own border, no card chrome.
   * "card": standalone bordered card (message list).
   */
  variant?: "composer" | "card";
  className?: string;
}

/** Below this a member is "out of credits"; above it just short for this message. */
const MIN_SHORT_OF_CREDITS_BALANCE = 1;

/** First day of next month: when the free allowance refills (credits/free-allowance.ts). */
function nextFreeRefill(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

/**
 * Shown instead of a raw error when a turn is refused for lack of credits
 * (402) or the balance is empty. Every state ends one tap from more credits:
 * - Guests: free account first (what it gives, from config), back to this chat.
 * - Unverified accounts: confirm the email (unlocks the free credits), paid
 *   offers below for anyone who won't wait.
 * - Members without a plan: the cheapest plans with one-tap checkout (packs
 *   need a plan), when the free credits refill, and the newsletter bonus.
 * - Subscribers: a pack and the next tier up, and when the plan renews.
 */
export function OutOfCreditsCard({
  locale,
  isGuest,
  reason,
  onDismiss,
  variant = "card",
  className,
}: OutOfCreditsCardProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div
      data-testid="out-of-credits-card"
      className={cn(
        "@container/ooc relative w-full",
        variant === "card"
          ? "max-w-md rounded-2xl border border-border bg-card p-4 shadow-sm"
          : "px-1 pb-3 pt-1 border-b border-border/60",
        className,
      )}
    >
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="unset"
          onClick={onDismiss}
          title={t("outOfCredits.dismiss")}
          aria-label={t("outOfCredits.dismiss")}
          className="absolute right-0 top-0 h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Div className={cn(onDismiss && "pr-8")}>
        {reason ? (
          <Div className="flex flex-col items-start gap-2">
            <P>{frameworkMessages.scopedT(locale).t(reason)}</P>
            <Link
              href={`/${locale}/subscription/buy`}
              className="font-semibold text-primary underline"
            >
              {creditMessages.scopedT(locale).t("purchase.post.title")}
            </Link>
          </Div>
        ) : isGuest ? (
          <GuestBody locale={locale} />
        ) : (
          <MemberBody locale={locale} />
        )}
      </Div>
    </Div>
  );
}

/** Icon tile + title + one line: the shared head of every state. */
function CardHead({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-1 items-start gap-3">
      <Div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        {icon}
      </Div>
      <Div className="flex min-w-0 flex-col gap-0.5 pt-px">
        <P className="m-0 text-sm font-semibold leading-tight text-foreground">
          {title}
        </P>
        <P className="m-0 text-sm leading-snug text-muted-foreground">
          {description}
        </P>
      </Div>
    </Div>
  );
}

/** Account first: what a free account gives, sign up, back to this chat. */
function GuestBody({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const pricing = getPricingParams(locale);
  return (
    <GuestAuthBody
      signupTestId="out-of-credits-signup"
      locale={locale}
      title={t("outOfCredits.guest.title")}
      description={t("outOfCredits.guest.description", {
        signedIn: pricing.freeCreditsSignedIn,
        max: pricing.freeCreditsMax,
      })}
    />
  );
}

/**
 * Guest head + sign up (primary) / log in (secondary). Both return to the
 * current page after auth.
 */
function GuestAuthBody({
  locale,
  title,
  description,
  signupTestId,
}: {
  locale: CountryLanguage;
  title: string;
  description: string;
  signupTestId?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const pathname = usePathname();
  // Signup and login both return to this exact chat.
  const callback = `callbackUrl=${encodeURIComponent(pathname)}`;

  return (
    <Div className="flex flex-col gap-3 @2xl/ooc:flex-row @2xl/ooc:items-center @2xl/ooc:gap-6">
      <Div className="flex min-w-0 flex-1 flex-col gap-2">
        <CardHead
          icon={<Gift className="h-4 w-4" />}
          title={title}
          description={description}
        />
        <Div className="pl-11">
          <P
            data-testid="guest-privacy-line"
            className="m-0 flex items-start gap-1.5 text-xs leading-snug text-muted-foreground"
          >
            <Lock className="mt-px h-3 w-3 flex-shrink-0" />
            <Span>{t("outOfCredits.guest.privacy")}</Span>
          </P>
        </Div>
      </Div>
      <Div className="flex flex-shrink-0 flex-col gap-2 @md/ooc:ml-11 @md/ooc:flex-row @md/ooc:flex-wrap @md/ooc:items-center @md/ooc:gap-x-4 @md/ooc:gap-y-2 @2xl/ooc:ml-0">
        <Button asChild size="sm" className="w-full @md/ooc:w-auto">
          <Link
            data-testid={signupTestId}
            href={`/${locale}/user/signup?${callback}`}
          >
            <Gift className="mr-1.5 h-4 w-4" />
            {t("outOfCredits.guest.signUp")}
          </Link>
        </Button>
        <P className="m-0 whitespace-nowrap text-center text-xs text-muted-foreground @md/ooc:text-left">
          {t("outOfCredits.guest.haveAccount")}{" "}
          <Link
            href={`/${locale}/user/login?${callback}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("outOfCredits.guest.logIn")}
          </Link>
        </P>
      </Div>
    </Div>
  );
}

/**
 * Guest in a folder only signed-in users may post in (Public): the way to an
 * account instead of a bare "no permission" line. Same chrome as the
 * out-of-credits card in the composer.
 */
export function SignInToPostCard({
  locale,
  className,
}: {
  locale: CountryLanguage;
  className?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div
      data-testid="sign-in-to-post-card"
      className={cn("@container/ooc relative w-full px-1 pb-3 pt-1", className)}
    >
      <GuestAuthBody
        locale={locale}
        title={t("input.signInToPost.title")}
        description={t("input.signInToPost.description")}
      />
    </Div>
  );
}

/**
 * Signed in. Unverified accounts lead with "confirm your email" (that is what
 * unlocks their free credits); everyone gets the real offers one tap away.
 */
function MemberBody({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const freeStatus = useFreeCreditsStatus(user, logger, !user.isPublic);
  const balance = useCreditsTotal(user, logger, !user.isPublic);
  const subscription = useSubscription(logger, user).read?.data;
  // A plan that ended renews nothing: those accounts get the free refill date.
  const hasPlan = isLivePlan(subscription);

  if (freeStatus === FreeCreditsStatus.VERIFY_EMAIL) {
    return (
      <Div className="flex flex-col">
        <VerifyEmailCreditsPrompt locale={locale} variant="lead" />
        <Div className="mt-3 flex flex-col gap-2 border-t border-dashed border-border/70 pt-3 @md/ooc:pl-11">
          <P className="m-0 text-xs font-medium text-muted-foreground">
            {t("outOfCredits.member.orTopUp")}
          </P>
          <CreditOffers locale={locale} />
        </Div>
      </Div>
    );
  }

  const dateFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };
  const renewsAt =
    hasPlan && subscription?.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;

  // Credits left, just not enough for this message (long thread, pricey
  // model): "you're out of credits" would be wrong (prod: 11.55 credits, a
  // kimi-k3 turn needing 20.7). Point at the cheaper ways forward first.
  const shortOfCredits =
    balance !== undefined && balance >= MIN_SHORT_OF_CREDITS_BALANCE;

  return (
    <Div className="flex flex-col">
      <CardHead
        icon={<Coins className="h-4 w-4" />}
        title={
          shortOfCredits
            ? t("outOfCredits.member.shortTitle")
            : t("outOfCredits.member.title")
        }
        description={
          shortOfCredits
            ? t("outOfCredits.member.shortDescription", {
                balance: formatCreditAmount(balance, locale),
              })
            : renewsAt
              ? t("outOfCredits.member.subscriberDescription", {
                  date: renewsAt.toLocaleDateString(locale, dateFormat),
                })
              : t("outOfCredits.member.description", {
                  date: nextFreeRefill().toLocaleDateString(locale, dateFormat),
                })
        }
      />
      <CreditOffers locale={locale} className="mt-3 @md/ooc:pl-11" />
      <NewsletterBonus locale={locale} />
    </Div>
  );
}

/**
 * Newsletter bonus row: one-click explicit opt-in while the account never
 * subscribed, a confirm reminder while the double opt-in is pending, nothing
 * once claimed.
 */
function NewsletterBonus({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { data, claim, isClaiming } = useNewsletterCreditBonus(
    user,
    logger,
    !user.isPublic,
  );
  const [error, setError] = useState<string | null>(null);

  if (!data) {
    return null;
  }
  const params = { bonus: String(data.bonusCredits), email: data.email };

  if (data.offer === NewsletterCreditOffer.PENDING_CONFIRMATION) {
    return (
      <Div
        data-testid="newsletter-credit-pending"
        className="mt-3 flex items-start gap-2 border-t border-dashed border-border/70 pt-3 text-xs leading-snug text-muted-foreground @md/ooc:pl-11"
      >
        <Mail className="mt-px h-3.5 w-3.5 flex-shrink-0 text-primary" />
        <Span>{t("outOfCredits.member.newsletter.pending", params)}</Span>
      </Div>
    );
  }

  if (data.offer !== NewsletterCreditOffer.AVAILABLE) {
    return null;
  }

  return (
    <Div
      data-testid="newsletter-credit-offer"
      className="mt-3 flex flex-col gap-2.5 border-t border-dashed border-border/70 pt-3 @md/ooc:pl-11 @2xl/ooc:flex-row @2xl/ooc:items-center @2xl/ooc:gap-6"
    >
      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <P className="m-0 text-sm font-medium leading-tight text-foreground">
          {t("outOfCredits.member.newsletter.title", params)}
        </P>
        <P className="m-0 text-xs leading-snug text-muted-foreground">
          {t("outOfCredits.member.newsletter.consent", params)}
        </P>
        {error && (
          <Div
            role="alert"
            className="mt-1 flex items-start gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
            <Span>{error}</Span>
          </Div>
        )}
      </Div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isClaiming}
        onClick={async (): Promise<void> => {
          setError(null);
          const result = await claim();
          if (result.kind === "error") {
            setError(result.message);
          }
        }}
        className="w-full flex-shrink-0 @md/ooc:w-auto @md/ooc:self-start @2xl/ooc:self-center"
      >
        {isClaiming ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            {t("outOfCredits.member.newsletter.claiming")}
          </>
        ) : (
          <>
            <Mail className="mr-1.5 h-4 w-4" />
            {t("outOfCredits.member.newsletter.claim", params)}
          </>
        )}
      </Button>
    </Div>
  );
}
