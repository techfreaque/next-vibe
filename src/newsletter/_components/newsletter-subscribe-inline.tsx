"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Inbox } from "next-vibe/ui/components/icons/Inbox";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useId, useState } from "react";

import { useNewsletterEmail } from "@/newsletter/promo-state";
import type { StatusGetResponseOutput } from "@/newsletter/status/definition";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import { scopedTranslation } from "./i18n";
import {
  useInlineNewsletterAddressStatus,
  useInlineNewsletterPromo,
  useInlineNewsletterSubscription,
} from "./use-inline-newsletter";

/**
 * Shared, self-contained, state-aware newsletter prompt.
 *
 * Reads the visitor's own subscription from the shared newsletter cache:
 * - confirmed: renders nothing (or a compact "You're subscribed" notice when
 *   `showSubscribedNotice`, for places where the section must stay)
 * - pending: "Check your inbox to confirm" + resend, no form
 * - none: the subscribe form with tier-correct credit copy
 * - loading: a same-size skeleton, so nothing flashes or jumps
 *
 * Subscribing uses the dedicated newsletter page's double opt-in endpoint.
 */
interface NewsletterSubscribeInlineProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userEmail: string | undefined;
  /**
   * `compact` — one-line email + button, for tight spots like the footer.
   * `card` — stacked heading/subheading/form, for panels like the profile hub.
   */
  variant?: "compact" | "card";
  /** Show the tier-correct free-credit line (true by default). */
  showBonus?: boolean;
  /** Confirmed subscribers see "You're subscribed" + manage link instead of nothing. */
  showSubscribedNotice?: boolean;
  /** Own status from a server loader, for a flash-free SSR render. */
  initialStatus?: StatusGetResponseOutput;
  className?: string;
}

export function NewsletterSubscribeInline({
  locale,
  user,
  userEmail,
  variant = "compact",
  showBonus = true,
  showSubscribedNotice = false,
  initialStatus,
  className,
}: NewsletterSubscribeInlineProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const promo = useInlineNewsletterPromo(locale, user, initialStatus);
  const manualEmail = useNewsletterEmail((state) => state.email);
  const setManualEmail = useNewsletterEmail((state) => state.setEmail);
  const [editing, setEditing] = useState(false);
  const validationMessageId = useId();
  const email = userEmail || manualEmail;
  const isLoggedIn = !user.isPublic;
  const { submit, isPending, result, invalidEmail, clearValidationError } =
    useInlineNewsletterSubscription(locale, user, promo.refresh);
  const isSubscribed = useInlineNewsletterAddressStatus(
    locale,
    user,
    email,
    editing && promo.state === "none" && !isPending,
  );

  const isCard = variant === "card";

  if (promo.state === "loading") {
    return (
      <Div className={cn("flex w-full flex-col gap-3", className)}>
        {isCard && <Skeleton className="h-10 w-full rounded-lg" />}
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </Div>
    );
  }

  if (promo.state === "confirmed") {
    if (!showSubscribedNotice) {
      return <></>;
    }
    return (
      <NewsletterSubscribedNotice
        locale={locale}
        isGuest={user.isPublic}
        className={className}
      />
    );
  }

  if (promo.state === "pending") {
    return (
      <NewsletterPendingNotice
        locale={locale}
        user={user}
        email={promo.email ?? userEmail}
        className={className}
      />
    );
  }

  const hasValidationError = invalidEmail === email;
  let notificationMessage: string | null = null;
  if (hasValidationError) {
    notificationMessage = t("invalidEmail");
  } else if (result === "error") {
    notificationMessage = t("error");
  } else if (result === "sent") {
    notificationMessage = t("success");
  } else if (isSubscribed) {
    notificationMessage = t("alreadyIn");
  }

  return (
    <Div className={cn("flex w-full flex-col gap-3", className)}>
      {isCard && (
        <Div className="flex flex-col gap-1">
          <Span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            {t("heading")}
          </Span>
          <Span className="text-xs leading-snug text-muted-foreground">
            {isLoggedIn ? t("subheadingLoggedIn") : t("subheadingPublic")}
          </Span>
        </Div>
      )}

      <Form
        noValidate
        onSubmit={() => submit(email)}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <Input<"email">
          type="email"
          placeholder={t("emailPlaceholder")}
          className="h-11 flex-1 text-sm"
          autoComplete="email"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onFocus={() => setEditing(true)}
          onChange={(event) => {
            if (user.isPublic) {
              setEditing(true);
              clearValidationError();
              setManualEmail(event.target.value);
            }
          }}
          aria-label={t("emailPlaceholder")}
          aria-invalid={hasValidationError || undefined}
          aria-describedby={
            hasValidationError ? validationMessageId : undefined
          }
          disabled={isPending || isLoggedIn}
          name="email"
          id={`newsletter-email-inline-${variant}`}
        />
        <Button
          type="submit"
          size="default"
          className="h-11 gap-2 text-sm font-medium"
          aria-label={t("subscribe")}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("subscribe")}
        </Button>
      </Form>

      {notificationMessage !== null && (
        <Div
          id={hasValidationError ? validationMessageId : undefined}
          role={hasValidationError ? "alert" : undefined}
          className={cn(
            "rounded-lg border px-3 py-2 text-xs",
            hasValidationError || result === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-success/30 bg-success/10 text-success",
          )}
        >
          {notificationMessage}
        </Div>
      )}

      {showBonus && (
        <Span className="inline-flex items-start gap-2 text-xs leading-snug text-muted-foreground">
          <Gift className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          {user.isPublic ? (
            <Span>
              {t("bonusGuest", {
                freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
                freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
              })}{" "}
              <Link
                href={`/${locale}/user/signup`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("bonusGuestLink")}
              </Link>
            </Span>
          ) : (
            t("bonusAccount", {
              bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
              freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
            })
          )}
        </Span>
      )}

      <Span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        {isLoggedIn ? t("loggedInHint") : t("privacy")}
      </Span>
    </Div>
  );
}

/**
 * Pending double opt-in: tell them where the link went and let them resend.
 * Resend re-posts subscribe for the same address; the route mails the welcome
 * email (with the confirm link) again. Exported for the out-of-credits card
 * and the newsletter page.
 */
export function NewsletterPendingNotice({
  locale,
  user,
  email,
  className,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  email: string | undefined;
  className?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const promo = useInlineNewsletterPromo(locale, user);
  const { submit, isPending, result, invalidEmail } =
    useInlineNewsletterSubscription(locale, user, promo.refresh);

  return (
    <Div
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3",
        className,
      )}
      data-testid="newsletter-pending"
    >
      <Span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <Inbox className="h-4 w-4 shrink-0 text-primary" />
        {t("pending.title")}
      </Span>
      <Span className="text-xs leading-snug text-muted-foreground">
        {email ? t("pending.bodyWithEmail", { email }) : t("pending.body")}
        {!user.isPublic &&
          ` ${t("pending.bonus", {
            bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
          })}`}
      </Span>
      {email && (
        <Div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto min-h-8 px-0 text-xs font-medium"
            disabled={isPending || result === "sent"}
            onClick={() => submit(email)}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            {isPending ? t("pending.resending") : t("pending.resend")}
          </Button>
          {result === "sent" && (
            <Span className="text-xs text-success">{t("pending.resent")}</Span>
          )}
          {(invalidEmail === email || result === "error") && (
            <Span className="text-xs text-destructive">
              {t(invalidEmail === email ? "invalidEmail" : "error")}
            </Span>
          )}
        </Div>
      )}
    </Div>
  );
}

/** Confirmed subscriber, where the section must stay (profile hub). */
export function NewsletterSubscribedNotice({
  locale,
  isGuest,
  className,
}: {
  locale: CountryLanguage;
  isGuest: boolean;
  className?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div
      className={cn(
        "flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
      data-testid="newsletter-subscribed"
    >
      <Div className="flex flex-col gap-0.5">
        <Span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckCircle className="h-4 w-4 shrink-0 text-success" />
          {t("subscribedNotice.title")}
        </Span>
        <Span className="text-xs leading-snug text-muted-foreground">
          {isGuest
            ? t("subscribedNotice.body")
            : t("subscribedNotice.bonus", {
                bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
              })}
        </Span>
      </Div>
      <Link
        href={`/${locale}/story/newsletter`}
        className="inline-flex min-h-11 shrink-0 items-center text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("subscribedNotice.manage")}
      </Link>
    </Div>
  );
}
