/**
 * Lead Magnet Capture Form
 *
 * The one email-capture card for a creator's active lead magnet. Embedded by the
 * skill page (landing + panel) and the creator profile — both live inside their
 * own endpoint's <form>, so this card submits via the API client on click
 * instead of rendering a nested <form>.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import React, { useCallback, useState } from "react";
import { z } from "zod";

import captureEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

type CaptureState = "idle" | "submitting" | "done" | "error";

const emailSchema = z.email();

export function LeadCaptureForm({
  skillId,
  headline,
  buttonText,
}: {
  skillId: string;
  /** Creator's configured copy — falls back to the default when not set. */
  headline: string | null;
  buttonText: string | null;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { t } = scopedTranslation.scopedT(locale);
  const [state, setState] = useState<CaptureState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  // Set on a submit attempt with missing input: marks the fields instead of
  // greying the button out, so the form never looks dead.
  const [attempted, setAttempted] = useState(false);

  const trimmedName = firstName.trim();
  const trimmedEmail = email.trim();
  const canSubmit =
    state !== "submitting" &&
    trimmedName.length > 0 &&
    emailSchema.safeParse(trimmedEmail).success;

  const nameInvalid = attempted && trimmedName.length === 0;
  const emailInvalid =
    attempted && !emailSchema.safeParse(trimmedEmail).success;

  const handleSubmit = useCallback((): void => {
    if (!canSubmit) {
      setAttempted(true);
      return;
    }
    setState("submitting");
    void (async (): Promise<void> => {
      const result = await apiClient.mutate(
        captureEndpoints.POST,
        logger,
        user,
        { skillId, firstName: trimmedName, email: trimmedEmail },
        undefined,
        locale,
      );
      setState(result.success ? "done" : "error");
    })();
  }, [canSubmit, skillId, trimmedName, trimmedEmail, user, locale, logger]);

  if (state === "done") {
    return (
      <Div className="flex flex-col items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-5 py-6 text-center">
        <Span className="text-base font-semibold text-foreground">
          {t("form.doneHeading")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("form.doneSub")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col items-center gap-3 text-center">
      <Span className="text-base font-semibold text-foreground">
        {headline ?? t("form.headline")}
      </Span>
      <Div className="flex w-full max-w-[340px] flex-col gap-2">
        <Input
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e): void => setFirstName(e.target.value)}
          placeholder={t("form.namePlaceholder")}
          aria-label={t("submit.fields.firstName.label")}
          aria-invalid={nameInvalid}
          disabled={state === "submitting"}
          className={
            nameInvalid ? "border-destructive bg-background" : "bg-background"
          }
        />
        <Input<"email">
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          onKeyDown={(e): void => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={t("form.emailPlaceholder")}
          aria-label={t("submit.fields.email.label")}
          aria-invalid={emailInvalid}
          disabled={state === "submitting"}
          className={
            emailInvalid ? "border-destructive bg-background" : "bg-background"
          }
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={state === "submitting"}
        >
          {state === "submitting"
            ? t("form.sending")
            : (buttonText ?? t("form.send"))}
        </Button>
        {state === "error" && (
          <Span role="alert" className="text-xs text-destructive">
            {t("form.error")}
          </Span>
        )}
      </Div>
      <Span className="text-[11px] text-muted-foreground">
        {t("form.finePrint")}
      </Span>
    </Div>
  );
}
