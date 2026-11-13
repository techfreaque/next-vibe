"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { useNewsletterManager } from "@/newsletter/hooks";
import {
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import { scopedTranslation } from "./i18n";

/**
 * Shared, self-contained newsletter subscribe form.
 *
 * Reuses the canonical `useNewsletterManager` hook (same subscribe endpoint as
 * the dedicated /story/newsletter page), so every entry point stays DRY and
 * double opt-in is preserved. Drop it anywhere a visitor or signed-in user
 * should be able to subscribe: the story footer, the profile hub, the blog
 * index, and so on.
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
  /** Show the account + newsletter free-credit line (true by default). */
  showBonus?: boolean;
  className?: string;
}

export function NewsletterSubscribeInline({
  locale,
  user,
  userEmail,
  variant = "compact",
  showBonus = true,
  className,
}: NewsletterSubscribeInlineProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const {
    email,
    isLoggedIn,
    isSubmitting,
    isAnyOperationInProgress,
    notification,
    subscribe,
    isSubscribed,
    handleEmailChange,
  } = useNewsletterManager(user, userEmail);

  // Already subscribed: hide every inline entry point entirely (profile, story
  // footer, chat sidebar). A signed-in subscriber should not see a subscribe
  // form at all, rather than a disabled "Subscribed" state. The dedicated
  // /story/newsletter page still shows manage/unsubscribe controls.
  //
  // Exception: keep rendering through the brief success state right after THIS
  // form subscribes, so the user sees the confirmation ("check your email")
  // instead of the component vanishing the instant the mutation resolves.
  const justSubscribedHere = notification?.type === "success";
  if (isSubscribed && !justSubscribedHere) {
    return <></>;
  }

  const isCard = variant === "card";

  const notificationMessage =
    notification?.type === "error"
      ? t("error")
      : notification?.type === "success"
        ? t("success")
        : isSubscribed
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
          if (isSubscribed || !email.includes("@")) {
            return;
          }
          subscribe(email);
        }}
        className={cn(
          "flex gap-2",
          isCard ? "flex-col sm:flex-row" : "flex-col sm:flex-row",
        )}
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
          disabled={isAnyOperationInProgress || isLoggedIn || isSubscribed}
          name="email"
          id={`newsletter-email-inline-${variant}`}
        />
        <Button
          type="submit"
          size="default"
          variant={isSubscribed ? "outline" : "default"}
          className="h-11 gap-2 text-sm font-medium"
          aria-label={isSubscribed ? t("subscribed") : t("subscribe")}
          disabled={isAnyOperationInProgress || isSubscribed}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <Check className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubscribed ? t("subscribed") : t("subscribe")}
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
          {t("bonus", {
            freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
            freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
          })}
        </Span>
      )}

      <Span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        {isLoggedIn ? t("loggedInHint") : t("privacy")}
      </Span>
    </Div>
  );
}
