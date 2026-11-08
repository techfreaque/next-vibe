/**
 * Verify Email widget (all platforms).
 * Web: landing for the mailed link (token prefilled -> verifies on open) and a
 * one-button resend when opened without a token. CLI/MCP: plain status line.
 */

"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Link } from "next-vibe/ui/components/link";
import { H1, P } from "next-vibe/ui/components/typography";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

import type definition from "./definition";

export function VerifyEmailWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const submitting = useWidgetIsSubmitting() ?? false;
  const data = useWidgetValue<typeof definition.POST>();
  const res = data !== undefined && "verified" in data ? data : undefined;
  const hasToken = Boolean(form?.formState.defaultValues?.token);

  // A mailed link carries the token: verify as soon as the page opens
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || !hasToken || !onSubmit) {
      return;
    }
    fired.current = true;
    onSubmit();
  }, [hasToken, onSubmit]);

  if (isCli) {
    return (
      <Div className="flex flex-col gap-1">
        <FormAlertWidget field={{}} />
        {res && <P className="m-0">{res.message}</P>}
      </Div>
    );
  }

  const done = res?.verified === true;
  return (
    <Div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm">
      {done ? (
        <CheckCircle className="h-10 w-10 text-success" />
      ) : (
        <Mail className="h-10 w-10 text-primary" />
      )}
      <H1 className="m-0 text-2xl font-semibold tracking-tight">
        {done ? t("widget.doneTitle") : t("widget.heroTitle")}
      </H1>
      <P className="m-0 text-muted-foreground">
        {done ? t("widget.doneDescription") : t("widget.heroDescription")}
      </P>
      <FormAlertWidget field={{}} />
      {done ? (
        <Link
          href={`/${locale}/threads`}
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground"
        >
          {t("widget.continue")}
        </Link>
      ) : (
        !hasToken && (
          <Button
            type="button"
            disabled={submitting}
            onClick={(): void => {
              onSubmit?.();
            }}
            className="h-11"
          >
            {submitting ? t("widget.confirming") : t("widget.resend")}
          </Button>
        )
      )}
      {!done && hasToken && !submitting && res === undefined && (
        <Button
          type="button"
          onClick={(): void => {
            onSubmit?.();
          }}
          className="h-11"
        >
          {t("widget.confirmButton")}
        </Button>
      )}
    </Div>
  );
}
