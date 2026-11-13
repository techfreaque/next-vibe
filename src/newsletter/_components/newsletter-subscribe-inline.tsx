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
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import {
  refetchOwnNewsletterStatus,
  useNewsletterManager,
  useNewsletterPromo,
} from "@/newsletter/hooks";
import type { StatusGetResponseOutput } from "@/newsletter/status/definition";
import subscribeEndpoints from "@/newsletter/subscribe/definition";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import { scopedTranslation } from "./i18n";

/**
 * Shared, self-contained, state-aware newsletter prompt.
 *
 * State comes from `useNewsletterPromo` (the visitor's OWN subscription), the
 * same source every other newsletter surface reads:
 * - confirmed: renders nothing (or a compact "You're subscribed" notice when
 *   `showSubscribedNotice`, for places where the section must stay)
 * - pending: "Check your inbox to confirm" + resend, no form
 * - none: the subscribe form with tier-correct credit copy
 * - loading: a same-size skeleton, so nothing flashes or jumps
 *
 * Subscribing reuses `useNewsletterManager` (same endpoint as the dedicated
 * /story/newsletter page), so double opt-in is preserved.
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
  const promo = useNewsletterPromo(user, initialStatus);

  const {
    email,
    isLoggedIn,
    isSubmitting,
    isAnyOperationInProgress,
    notification,
    subscribe,
    handleEmailChange,
  } = useNewsletterManager(user, userEmail);

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
        isGuest={promo.isGuest}
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

  const notificationMessage =
    notification?.type === "error"
      ? t("error")
      : notification?.type === "success"
        ? t("success")
        : notification?.type === "info"
          ? t("alreadyIn")
          : null;

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
        onSubmit={() => {
          if (!email.includes("@")) {
            return;
          }
          subscribe(email);
        }}
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
          onChange={handleEmailChange}
          aria-label={t("emailPlaceholder")}
          disabled={isAnyOperationInProgress || isLoggedIn}
          name="email"
          id={`newsletter-email-inline-${variant}`}
        />
        <Button
          type="submit"
          size="default"
          className="h-11 gap-2 text-sm font-medium"
          aria-label={t("subscribe")}
          disabled={isAnyOperationInProgress}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("subscribe")}
        </Button>
      </Form>

      {notificationMessage !== null && (
        <Div
          className={cn(
            "rounded-lg border px-3 py-2 text-xs",
            notification?.type === "error"
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
          {promo.isGuest ? (
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
  const logger = useLogger();
  const mutation = useApiMutation(subscribeEndpoints.POST, logger, user);
  const { mutateAsync } = mutation;
  const [result, setResult] = useState<"sent" | "error" | null>(null);

  const resend = useCallback(async (): Promise<void> => {
    if (!email) {
      return;
    }
    try {
      const response = await mutateAsync({ requestData: { email } });
      setResult(response.success ? "sent" : "error");
      await refetchOwnNewsletterStatus(logger);
    } catch {
      // useApiMutation rejects with the error response; show it inline
      setResult("error");
    }
  }, [email, mutateAsync, logger]);

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
            disabled={mutation.isPending || result === "sent"}
            onClick={() => {
              void resend();
            }}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            {mutation.isPending ? t("pending.resending") : t("pending.resend")}
          </Button>
          {result === "sent" && (
            <Span className="text-xs text-success">{t("pending.resent")}</Span>
          )}
          {result === "error" && (
            <Span className="text-xs text-destructive">{t("error")}</Span>
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
