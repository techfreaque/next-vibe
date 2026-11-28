"use client";

/**
 * "Confirm your email to get your free credits" + one-click resend.
 * Shown wherever free credits are held back for an unverified account
 * (credits / subscription pages, the chat's out-of-credits card). The caller
 * decides when (credits freeStatus === VERIFY_EMAIL); this only renders and
 * resends through the verify-email endpoint (no token = resend).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useOptionalWidgetLogger,
  useOptionalWidgetUser,
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
  /** Passed by standalone pages rendered outside WidgetContextStoreProvider. */
  user?: JwtPayloadType;
  /** Passed by standalone pages rendered outside WidgetContextStoreProvider. */
  logger?: EndpointLogger;
  /**
   * "banner": standalone warning box (credits / subscription pages).
   * "lead": the headline of the chat's out-of-credits card (sits in its
   *   `@container/ooc`), for an unverified account that ran dry.
   */
  variant?: "banner" | "lead";
  className?: string;
}

export function VerifyEmailCreditsPrompt({
  locale,
  user: propUser,
  logger: propLogger,
  variant = "banner",
  className,
}: VerifyEmailCreditsPromptProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const ctxUser = useOptionalWidgetUser();
  const ctxLogger = useOptionalWidgetLogger();
  const fallbackLogger = useLogger();
  const user = propUser ?? ctxUser;
  const logger = propLogger ?? ctxLogger ?? fallbackLogger;
  const mutation = useApiMutation(
    verifyEmailDefinitions.POST,
    logger,
    user ?? { isPublic: true, leadId: "", roles: [] },
  );
  const [state, setState] = useState<ResendState>({ kind: "idle" });

  if (!user || user.isPublic) {
    return null;
  }

  const credits = getPricingParams(locale).freeCreditsSignedIn;
  const sending = mutation.isPending;

  const resend = async (): Promise<void> => {
    // mutateAsync resolves with the ErrorResponseType on failure
    const result = await mutation.mutateAsync({ requestData: {} });
    setState(
      result.success
        ? { kind: "sent", email: result.data.email }
        : { kind: "error", message: result.message },
    );
  };

  const feedback =
    state.kind === "sent" ? (
      <Div
        aria-live="polite"
        className="mt-1 flex items-start gap-1.5 text-xs text-success"
      >
        <CheckCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
        <Span>{t("creditsPrompt.sent", { email: state.email })}</Span>
      </Div>
    ) : state.kind === "error" ? (
      <Div
        role="alert"
        className="mt-1 flex items-start gap-1.5 text-xs text-destructive"
      >
        <AlertCircle className="mt-px h-3.5 w-3.5 flex-shrink-0" />
        <Span>{state.message}</Span>
      </Div>
    ) : null;

  const resendButton = (buttonClassName: string): JSX.Element => (
    <Button
      type="button"
      size="sm"
      variant={variant === "lead" ? "default" : "outline"}
      disabled={sending}
      onClick={(): void => {
        void resend();
      }}
      className={buttonClassName}
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
  );

  if (variant === "lead") {
    return (
      <Div
        data-testid="verify-email-credits-prompt"
        className={cn(
          "flex flex-col gap-3 @2xl/ooc:flex-row @2xl/ooc:items-center @2xl/ooc:gap-6",
          className,
        )}
      >
        <Div className="flex min-w-0 flex-1 items-start gap-3">
          <Div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning ring-1 ring-inset ring-warning/25">
            <Mail className="h-4 w-4" />
          </Div>
          <Div className="flex min-w-0 flex-col gap-0.5 pt-px">
            <P className="m-0 text-sm font-semibold leading-tight text-foreground">
              {t("creditsPrompt.title")}
            </P>
            <P className="m-0 text-sm leading-snug text-muted-foreground">
              {t("creditsPrompt.description", { credits })}
            </P>
            {feedback}
          </Div>
        </Div>
        {resendButton(
          "w-full flex-shrink-0 @md/ooc:ml-11 @md/ooc:w-auto @md/ooc:self-start @2xl/ooc:ml-0 @2xl/ooc:self-center",
        )}
      </Div>
    );
  }

  return (
    <Div
      data-testid="verify-email-credits-prompt"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
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
          {feedback}
        </Div>
      </Div>
      {resendButton("h-10 w-full flex-shrink-0 sm:h-9 sm:w-auto")}
    </Div>
  );
}
