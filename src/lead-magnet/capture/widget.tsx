/**
 * Lead Magnet Capture Form
 *
 * The one email-capture card for a creator's active lead magnet. Embedded by the
 * skill page (landing + panel) and the creator profile — both live inside their
 * own endpoint's <form>, so this card submits via the API client on click
 * instead of rendering a nested <form>.
 */

"use client";

import { SkillSourceFilter } from "next-vibe/agent/skills/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback, useState } from "react";
import { z } from "zod";

import captureEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

type CaptureState = "idle" | "submitting" | "done" | "error";

const emailSchema = z.email();

export function LeadMagnetCaptureContainer({
  field,
}: {
  field: typeof captureEndpoints.POST.fields;
}): React.JSX.Element {
  const t = useWidgetTranslation<typeof captureEndpoints.POST>();
  const result = useWidgetValue<typeof captureEndpoints.POST>();
  const responseOnly = useWidgetResponseOnly();
  const { children } = field;

  return (
    <AdminForm
      title={t("submit.groups.main.title")}
      description={t("submit.description")}
      primaryAction={
        !responseOnly && !result ? (
          <SubmitButtonWidget<typeof captureEndpoints.POST>
            field={{ text: "form.send" }}
          />
        ) : undefined
      }
      result={
        result ? (
          <ResultBanner
            variant={result.captured ? "success" : "info"}
            title={
              result.captured
                ? t("submit.response.captured")
                : t("submit.response.nextStep")
            }
          >
            <Button variant="outline" asChild>
              <Link href={result.signupUrl}>{t("form.signUp")}</Link>
            </Button>
          </ResultBanner>
        ) : undefined
      }
    >
      {!responseOnly && !result && (
        <AdminFormSection title={t("submit.groups.main.description")}>
          <EntityPickerFieldWidget
            fieldName="skillId"
            field={children.skillId}
            listData={{ sourceFilter: SkillSourceFilter.COMMUNITY }}
          />
          <TextFieldWidget fieldName="firstName" field={children.firstName} />
          <EmailFieldWidget fieldName="email" field={children.email} />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}

export function LeadCaptureForm({
  skillId,
  headline,
  buttonText,
  layout = "stacked",
}: {
  skillId: string;
  /** "inline": headline beside a one-row form, for wide landing sections. */
  layout?: "stacked" | "inline";
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

  const inline = layout === "inline";
  const fields = (
    <Div
      className={
        inline
          ? "flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-nowrap"
          : "flex w-full max-w-[340px] flex-col gap-2"
      }
    >
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
  );

  if (inline) {
    return (
      <Div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-8">
        <Div className="flex flex-col gap-1">
          <Span className="text-base font-semibold text-foreground">
            {headline ?? t("form.headline")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("form.finePrint")}
          </Span>
        </Div>
        {fields}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col items-center gap-3 text-center">
      <Span className="text-base font-semibold text-foreground">
        {headline ?? t("form.headline")}
      </Span>
      {fields}
      <Span className="text-[11px] text-muted-foreground">
        {t("form.finePrint")}
      </Span>
    </Div>
  );
}
