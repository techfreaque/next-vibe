/**
 * Newsletter Unsubscribe Widget
 *
 * Full unsubscribe surface — hero, form, info, and alternatives. Renders on every
 * platform via the endpoint's customWidgetObject; the story page mounts it through
 * EndpointsPage. No UI lives outside this widget.
 *
 * The form IS the endpoint's form (EndpointRenderer owns the <form>): the email
 * field, alert and submit button are the shared widgets, so validation, prefill
 * (/unsubscribe/[email] deep link, logged-in profile email) and errors flow
 * through the standard pipeline.
 */

"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React from "react";
import { z } from "zod";

import { useNewsletterStatus } from "@/newsletter/hooks";

import type definition from "./definition";

interface UnsubscribeWidgetProps {
  field: (typeof definition.POST)["fields"];
}

const emailSchema = z.email();

export function UnsubscribeWidget({
  field,
}: UnsubscribeWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  const email = form?.watch("email") ?? "";
  const isValidEmail = emailSchema.safeParse(email).success;
  // Seeded via autoPrefillData: the deep link or a logged-in user's profile email
  const hasPrefilledEmail = Boolean(form?.formState.defaultValues?.email);

  // Tell the visitor whether the typed address is actually on the list
  const status = useNewsletterStatus(user, {
    email,
    enabled: !isCli && isValidEmail && !data?.success,
  });
  const statusResponse = status.read?.response;
  const isSubscribed =
    statusResponse?.success === true ? statusResponse.data.subscribed : null;

  const submitButton = (
    <SubmitButtonWidget<typeof definition.POST>
      field={{
        text: "unsubscribe.page.unsubscribeButton",
        loadingText: "unsubscribe.page.unsubscribing",
        icon: "bell-off",
        variant: "destructive",
        size: isCli ? "default" : "lg",
      }}
    />
  );

  if (isCli) {
    if (data?.success) {
      return (
        <Div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <Span className="font-semibold">
            {t("subscription.unsubscribe.success")}
          </Span>
        </Div>
      );
    }
    return (
      <Div className="flex flex-col gap-2">
        <FormAlertWidget field={{}} />
        <EmailFieldWidget fieldName="email" field={children.email} />
        {submitButton}
      </Div>
    );
  }

  return (
    <Div className="min-h-screen bg-background">
      <Div className="border-b border-border bg-linear-to-b from-primary/[0.05] to-background">
        <Div className="mx-auto w-full max-w-xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24">
          <H1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {t("unsubscribe.page.title")}
          </H1>
          <P className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            {hasPrefilledEmail
              ? t("unsubscribe.page.emailProvided.description")
              : t("unsubscribe.page.description")}
          </P>

          <Div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            {data?.success ? (
              <Div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle className="h-10 w-10 text-success" />
                <Span className="text-lg font-semibold">
                  {t("subscription.unsubscribe.success")}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {t("unsubscribe.page.info.immediate.description")}
                </Span>
              </Div>
            ) : (
              <Div className="flex flex-col gap-4">
                <FormAlertWidget field={{}} />
                <EmailFieldWidget fieldName="email" field={children.email} />
                {isValidEmail && isSubscribed !== null && (
                  <Span
                    className={`text-sm ${isSubscribed ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {isSubscribed
                      ? t("unsubscribe.page.status.subscribed")
                      : t("unsubscribe.page.status.notSubscribed")}
                  </Span>
                )}
                {submitButton}
              </Div>
            )}

            <Div className="mt-6 flex flex-col gap-4 border-t border-border pt-5">
              <Div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <Div className="text-sm">
                  <Span className="font-medium">
                    {t("unsubscribe.page.info.immediate.title")}
                  </Span>{" "}
                  <Span className="text-muted-foreground">
                    {t("unsubscribe.page.info.immediate.description")}
                  </Span>
                </Div>
              </Div>
              <Div className="flex gap-3">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <Div className="text-sm">
                  <Span className="font-medium">
                    {t("unsubscribe.page.info.resubscribe.title")}
                  </Span>{" "}
                  <Span className="text-muted-foreground">
                    {t("unsubscribe.page.info.resubscribe.description")}
                  </Span>
                </Div>
              </Div>
            </Div>
          </Div>

          <Div className="mt-6 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <Span>
              {t("unsubscribe.page.subscribeText")}{" "}
              <Link
                href={`/${locale}/story/newsletter`}
                className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("unsubscribe.page.subscribeLink")}
              </Link>
            </Span>
            <Link
              href={`/${locale}/help`}
              className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("unsubscribe.page.alternatives.contact")}
            </Link>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
