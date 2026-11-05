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

  const trimmedName = firstName.trim();
  const trimmedEmail = email.trim();
  const canSubmit =
    state !== "submitting" &&
    trimmedName.length > 0 &&
    emailSchema.safeParse(trimmedEmail).success;

  const handleSubmit = useCallback((): void => {
    if (!canSubmit) {
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
      <Div
        style={{
          padding: "24px 20px",
          borderRadius: 12,
          border: "1px solid rgba(139,92,246,0.25)",
          background: "rgba(139,92,246,0.08)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
        }}
      >
        <Span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
          {t("form.doneHeading")}
        </Span>
        <Span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
          {t("form.doneSub")}
        </Span>
      </Div>
    );
  }

  return (
    <Div
      style={{
        padding: "20px 20px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
        {headline ?? t("form.headline")}
      </Span>
      <Div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          maxWidth: 340,
        }}
      >
        <Input
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e): void => setFirstName(e.target.value)}
          placeholder={t("form.namePlaceholder")}
          aria-label={t("submit.fields.firstName.label")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
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
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {state === "submitting"
            ? t("form.sending")
            : (buttonText ?? t("form.send"))}
        </Button>
        {state === "error" && (
          <Span
            role="alert"
            style={{ fontSize: 12, color: "rgba(255,100,100,0.8)" }}
          >
            {t("form.error")}
          </Span>
        )}
      </Div>
      <Span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        {t("form.finePrint")}
      </Span>
    </Div>
  );
}
