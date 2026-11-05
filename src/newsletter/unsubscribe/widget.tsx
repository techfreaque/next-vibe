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
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import { assignUrl } from "next-vibe/ui/lib/location";
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
    <Div className="min-h-screen bg-red-50 bg-linear-to-br from-red-50 via-white to-orange-50 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <Div className="relative py-20 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t("unsubscribe.page.title")}
          </H1>
          <H2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t("unsubscribe.page.subtitle")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {hasPrefilledEmail
              ? t("unsubscribe.page.emailProvided.description")
              : t("unsubscribe.page.description")}
          </P>

          {/* Unsubscribe Form */}
          <Div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 max-w-md mx-auto text-left">
            {data?.success ? (
              <Div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle className="h-10 w-10 text-success" />
                <Span className="font-semibold text-lg">
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

            {/* Subscribe link */}
            <Div className="text-center mt-4">
              <P className="text-sm text-gray-500 dark:text-gray-400">
                {t("unsubscribe.page.subscribeText")}{" "}
                <Link
                  href={`/${locale}/story/newsletter`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {t("unsubscribe.page.subscribeLink")}
                </Link>
              </P>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Information Section */}
      <Div className="py-20 px-4 md:px-6 bg-white dark:bg-gray-800">
        <Div className="container mx-auto max-w-4xl">
          <Div className="text-center mb-16">
            <H2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("unsubscribe.page.info.title")}
            </H2>
            <P className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t("unsubscribe.page.info.description")}
            </P>
          </Div>

          <Div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <Div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-linear-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </Div>
              <H3 className="text-xl font-semibold mb-3">
                {t("unsubscribe.page.info.immediate.title")}
              </H3>
              <P className="text-gray-600 dark:text-gray-400">
                {t("unsubscribe.page.info.immediate.description")}
              </P>
            </Div>

            <Div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <Div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-linear-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Send className="h-8 w-8 text-white" />
              </Div>
              <H3 className="text-xl font-semibold mb-3">
                {t("unsubscribe.page.info.resubscribe.title")}
              </H3>
              <P className="text-gray-600 dark:text-gray-400">
                {t("unsubscribe.page.info.resubscribe.description")}
              </P>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Alternative Actions Section */}
      <Div className="py-16 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("unsubscribe.page.alternatives.title")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t("unsubscribe.page.alternatives.description")}
          </P>
          <Div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              onClick={() => {
                assignUrl(`/${locale}/story/newsletter`);
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t("unsubscribe.page.alternatives.subscribe")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                assignUrl(`/${locale}/help`);
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t("unsubscribe.page.alternatives.contact")}
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
