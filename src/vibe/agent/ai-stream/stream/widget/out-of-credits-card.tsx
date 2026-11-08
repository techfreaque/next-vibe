"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { X } from "next-vibe/ui/components/icons/X";
import { Input } from "next-vibe/ui/components/input";
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

import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation } from "../i18n";
import {
  type GuestCreditCaptureResult,
  useGuestCreditCapture,
} from "./guest-credit-capture";

interface OutOfCreditsCardProps {
  locale: CountryLanguage;
  /** Guests get email capture / sign up / log in; members are sent to top up. */
  isGuest: boolean;
  /** Shows a close button (composer placement). */
  onDismiss?: () => void;
  className?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shown instead of a raw error when a turn is refused for lack of credits
 * (402) or a guest's balance is empty. Guests: email for bonus credits first,
 * then sign up, then log in (back to this thread). Members: buy credits.
 */
export function OutOfCreditsCard({
  locale,
  isGuest,
  onDismiss,
  className,
}: OutOfCreditsCardProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const Icon = isGuest ? Mail : Coins;

  return (
    <Div
      data-testid="out-of-credits-card"
      className={cn(
        "relative flex w-full max-w-md flex-col gap-3 rounded-2xl border border-primary/30 bg-card px-4 py-4 shadow-sm",
        className,
      )}
    >
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          title={t("outOfCredits.dismiss")}
          aria-label={t("outOfCredits.dismiss")}
          className="absolute right-2 top-2 h-7 w-7 text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Div className="flex items-start gap-3">
        <Div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </Div>
        <Div className={cn("flex flex-col gap-1", onDismiss && "pr-7")}>
          <P className="text-sm font-semibold leading-snug text-foreground">
            {isGuest
              ? t("outOfCredits.guest.title")
              : t("outOfCredits.member.title")}
          </P>
          <P className="text-sm leading-snug text-muted-foreground">
            {isGuest
              ? t("outOfCredits.guest.description")
              : t("outOfCredits.member.description")}
          </P>
        </Div>
      </Div>
      {isGuest ? (
        <GuestActions locale={locale} />
      ) : (
        <Div className="flex sm:pl-12">
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href={`/${locale}/subscription/buy`}>
              {t("outOfCredits.member.getCredits")}
            </Link>
          </Button>
        </Div>
      )}
    </Div>
  );
}

/** Email capture (primary) → sign up → log in. */
function GuestActions({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const pathname = usePathname();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { capture, isSubmitting } = useGuestCreditCapture(user, logger);
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [result, setResult] = useState<GuestCreditCaptureResult | null>(null);

  const pricing = getPricingParams(locale);
  const bonusParams = { bonus: pricing.freeCreditsNewsletterBonus };
  const signedInParams = { signedIn: pricing.freeCreditsSignedIn };

  const submit = async (): Promise<void> => {
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setResult(await capture(trimmed));
  };

  const done = result?.kind === "added" || result?.kind === "confirm";

  return (
    <Div className="flex flex-col gap-3 sm:pl-12">
      {result && (result.kind === "added" || result.kind === "confirm") ? (
        <Div
          data-testid="guest-credit-capture-result"
          className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
          <Span>
            {result.kind === "added"
              ? t("outOfCredits.guest.added", {
                  bonus:
                    result.bonusCredits > 0
                      ? String(result.bonusCredits)
                      : bonusParams.bonus,
                })
              : t("outOfCredits.guest.confirm", {
                  bonus:
                    result.bonusCredits > 0
                      ? String(result.bonusCredits)
                      : bonusParams.bonus,
                })}
          </Span>
        </Div>
      ) : (
        <Div className="flex flex-col gap-1.5">
          <Div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              name="guest-credit-email"
              aria-label={t("outOfCredits.guest.emailLabel")}
              placeholder={t("outOfCredits.guest.emailPlaceholder")}
              autoComplete="email"
              value={email}
              disabled={isSubmitting}
              onChangeText={(text): void => {
                setEmail(text);
                if (invalid) {
                  setInvalid(false);
                }
              }}
              onKeyDown={(e): void => {
                // The card sits inside the composer's <form>: Enter must not send a chat message
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  void submit();
                }
              }}
              className={cn(
                "h-9 min-h-9 text-sm sm:flex-1",
                invalid && "border-destructive focus-visible:ring-destructive",
              )}
            />
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={(): void => {
                void submit();
              }}
              className="h-9 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  {t("outOfCredits.guest.emailSubmitting")}
                </>
              ) : (
                t("outOfCredits.guest.emailSubmit", bonusParams)
              )}
            </Button>
          </Div>
          {(invalid ||
            result?.kind === "error" ||
            result?.kind === "claimed") && (
            <Div
              role="alert"
              className="flex items-start gap-1.5 text-xs text-destructive"
            >
              <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
              <Span>
                {invalid
                  ? t("outOfCredits.guest.invalidEmail")
                  : result?.kind === "error"
                    ? result.message
                    : t("outOfCredits.guest.claimed", signedInParams)}
              </Span>
            </Div>
          )}
        </Div>
      )}

      <Div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Div className="h-px flex-1 bg-border" />
        <Span>{t("outOfCredits.guest.or")}</Span>
        <Div className="h-px flex-1 bg-border" />
      </Div>

      <Button
        asChild
        size="sm"
        variant={done ? "default" : "outline"}
        className="w-full"
      >
        <Link href={`/${locale}/user/signup`}>
          {t("outOfCredits.guest.signUp", signedInParams)}
        </Link>
      </Button>

      <P className="text-center text-xs text-muted-foreground">
        {t("outOfCredits.guest.haveAccount")}{" "}
        <Link
          href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(pathname)}`}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {t("outOfCredits.guest.logIn")}
        </Link>
      </P>
    </Div>
  );
}

/** True when a serialized stream error is a credit refusal (HTTP 402). */
export function isOutOfCreditsErrorCode(
  errorCode: number | undefined,
): boolean {
  return errorCode === ErrorResponseTypes.PAYMENT_REQUIRED.errorCode;
}
