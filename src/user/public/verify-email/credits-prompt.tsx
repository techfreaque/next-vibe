"use client";

/**
 * "Confirm your email to get your free credits" + one-click resend.
 * Shown wherever free credits are held back for an unverified account
 * (credits / subscription pages, the chat's out-of-credits card). The caller
 * decides when (credits freeStatus === VERIFY_EMAIL); this only renders and
 * resends through the verify-email endpoint (no token = resend).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isErrorResponseType } from "next-vibe/core/utils/parse-error";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import type { JSX } from "react";
import { useState } from "react";

import { getPricingParams } from "@/products/repository-client";

import verifyEmailDefinitions from "./definition";
import { scopedTranslation } from "./i18n";

type ResendState =
  | { kind: "idle" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

interface VerifyEmailCreditsPromptProps {
  locale: CountryLanguage;
  /**
   * "banner": standalone warning box (credits / subscription pages).
   * "row": a section inside another card (out-of-credits card).
   */
  variant?: "banner" | "row";
  className?: string;
}

export function VerifyEmailCreditsPrompt({
  locale,
  variant = "banner",
  className,
}: VerifyEmailCreditsPromptProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const mutation = useApiMutation(verifyEmailDefinitions.POST, logger, user);
  const [state, setState] = useState<ResendState>({ kind: "idle" });

  if (user.isPublic) {
    return null;
  }

  const credits = getPricingParams(locale).freeCreditsSignedIn;
  const sending = mutation.isPending;

  const resend = async (): Promise<void> => {
    try {
      const result = await mutation.mutateAsync({ requestData: {} });
      setState(
        result.success
          ? { kind: "sent", email: result.data.email }
          : { kind: "error", message: result.message },
      );
    } catch (err) {
      // useApiMutation rejects with the ErrorResponseType on failure
      setState({
        kind: "error",
        message: isErrorResponseType(err) ? err.message : String(err),
      });
    }
  };

  return (
    <Div
      data-testid="verify-email-credits-prompt"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        variant === "banner"
          ? "rounded-lg border border-warning/30 bg-warning/5 px-4 py-3.5"
          : "mt-3 border-t border-dashed border-border/70 pt-3",
        className,
      )}
    >
      <Div className="flex min-w-0 items-start gap-2.5">
        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
        <Div className="flex min-w-0 flex-col gap-0.5">
          <P className="m-0 text-sm font-semibold leading-tight text-foreground">
            {t("creditsPrompt.title")}
          </P>
          <P className="m-0 text-sm leading-snug text-muted-foreground">
            {t("creditsPrompt.description", { credits })}
          </P>
          {state.kind === "sent" && (
            <Div
              aria-live="polite"
              className="mt-1 flex items-start gap-1.5 text-xs text-success"
            >
              <CheckCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
              <Span>{t("creditsPrompt.sent", { email: state.email })}</Span>
            </Div>
          )}
          {state.kind === "error" && (
            <Div
              role="alert"
              className="mt-1 flex items-start gap-1.5 text-xs text-destructive"
            >
              <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
              <Span>{state.message}</Span>
            </Div>
          )}
        </Div>
      </Div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={sending}
        onClick={(): void => {
          void resend();
        }}
        className="h-10 w-full flex-shrink-0 sm:h-9 sm:w-auto"
      >
        {sending ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            {t("creditsPrompt.sending")}
          </>
        ) : (
          <>
            <Mail className="mr-1.5 h-4 w-4" />
            {t("creditsPrompt.resend")}
          </>
        )}
      </Button>
    </Div>
  );
}
