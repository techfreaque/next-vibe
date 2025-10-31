"use client";

import { Check, Mail, Send, X } from "lucide-react";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Form } from "next-vibe-ui/ui/form/form";
import { Input } from "next-vibe-ui/ui/input";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useEffect, useRef } from "react";

import { useNewsletterManager } from "@/app/api/[locale]/v1/core/newsletter/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UnsubscribePageProps {
  locale: CountryLanguage;
  prefilledEmail: string | undefined;
}

export function UnsubscribePage({
  locale,
  prefilledEmail,
}: UnsubscribePageProps): JSX.Element {
  const { t } = simpleT(locale);

  const {
    email,
    setEmail,
    isLoggedIn,
    isUnsubscribing,
    isAnyOperationInProgress,
    notification,
    showConfirmUnsubscribe,
    unsubscribe,
    handleEmailChange,
    // isSubmitting and isSubscribed are not used in unsubscribe page
  } = useNewsletterManager();

  // Track if we've already set the prefilled email to prevent infinite loops
  const hasSetPrefilledEmail = useRef(false);
  const lastPrefilledEmail = useRef<string | undefined>(undefined);

  // Set prefilled email when component mounts
  // Note: leadId is now handled server-side via JWT, no need to manage it client-side
  useEffect(() => {
    if (
      prefilledEmail &&
      !isLoggedIn &&
      !hasSetPrefilledEmail.current &&
      lastPrefilledEmail.current !== prefilledEmail
    ) {
      setEmail(prefilledEmail);
      hasSetPrefilledEmail.current = true;
      lastPrefilledEmail.current = prefilledEmail;
    }
  }, [prefilledEmail, isLoggedIn, setEmail]);

  return (
    <Div className="min-h-screen bg-red-50 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t("app.story.newsletter.unsubscribe.page.title")}
          </H1>
          <H2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t("app.story.newsletter.unsubscribe.page.subtitle")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {prefilledEmail
              ? t(
                  "app.story.newsletter.unsubscribe.page.emailProvided.description",
                )
              : t("app.story.newsletter.unsubscribe.page.description")}
          </P>

          {/* Unsubscribe Form */}
          <Div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 max-w-md mx-auto">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                // Validate email before submission
                if (!email?.includes("@")) {
                  return;
                }
                // Server gets leadId from JWT - no need to pass it
                unsubscribe(email);
              }}
              className="space-y-4"
            >
              <Div className="flex flex-col space-y-3">
                <Input
                  type="email"
                  placeholder={t("app.story.newsletter.emailPlaceholder")}
                  className="text-center text-lg py-3"
                  autoComplete="email"
                  autoCorrect="off"
                  spellCheck="false"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label={t("app.story.newsletter.emailPlaceholder")}
                  disabled={isAnyOperationInProgress || isLoggedIn}
                  name="email"
                  id="newsletter-unsubscribe-email"
                />

                <Button
                  type="submit"
                  className={`py-3 text-lg font-semibold ${
                    showConfirmUnsubscribe
                      ? "bg-red-600 hover:bg-red-700"
                      : "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  }`}
                  variant={showConfirmUnsubscribe ? "default" : "outline"}
                  aria-label={
                    showConfirmUnsubscribe
                      ? t(
                          "app.story.newsletter.subscription.unsubscribe.confirmButton",
                        )
                      : t(
                          "app.story.newsletter.unsubscribe.page.unsubscribeButton",
                        )
                  }
                  disabled={isAnyOperationInProgress}
                >
                  {isUnsubscribing ? (
                    <Div className="animate-spin mr-2">
                      <Div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    </Div>
                  ) : showConfirmUnsubscribe ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <X className="h-5 w-5 mr-2" />
                  )}
                  {showConfirmUnsubscribe
                    ? t(
                        "app.story.newsletter.subscription.unsubscribe.confirmButton",
                      )
                    : t(
                        "app.story.newsletter.unsubscribe.page.unsubscribeButton",
                      )}
                </Button>
              </Div>

              {/* Notification display */}
              {notification && (
                <Div
                  className={`text-sm p-3 rounded-lg ${
                    notification.type === "error"
                      ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : notification.type === "success"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : notification.type === "info"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                  }`}
                >
                  {t(notification.message)}
                </Div>
              )}
            </Form>

            {/* Subscribe link */}
            <Div className="text-center mt-4">
              <P className="text-sm text-gray-500 dark:text-gray-400">
                {t("app.story.newsletter.unsubscribe.page.subscribeText")}{" "}
                <Link
                  href={`/${locale}/newsletter`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {t("app.story.newsletter.unsubscribe.page.subscribeLink")}
                </Link>
              </P>
            </Div>
          </Div>
        </Div>
      </section>

      {/* Information Section */}
      <section className="py-20 px-4 md:px-6 bg-white dark:bg-gray-800">
        <Div className="container mx-auto max-w-4xl">
          <Div className="text-center mb-16">
            <H2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("app.story.newsletter.unsubscribe.page.info.title")}
            </H2>
            <P className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t("app.story.newsletter.unsubscribe.page.info.description")}
            </P>
          </Div>

          <Div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <Div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </Div>
              <H3 className="text-xl font-semibold mb-3">
                {t(
                  "app.story.newsletter.unsubscribe.page.info.immediate.title",
                )}
              </H3>
              <P className="text-gray-600 dark:text-gray-400">
                {t(
                  "app.story.newsletter.unsubscribe.page.info.immediate.description",
                )}
              </P>
            </Div>

            <Div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <Div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Send className="h-8 w-8 text-white" />
              </Div>
              <H3 className="text-xl font-semibold mb-3">
                {t(
                  "app.story.newsletter.unsubscribe.page.info.resubscribe.title",
                )}
              </H3>
              <P className="text-gray-600 dark:text-gray-400">
                {t(
                  "app.story.newsletter.unsubscribe.page.info.resubscribe.description",
                )}
              </P>
            </Div>
          </Div>
        </Div>
      </section>

      {/* Alternative Actions Section */}
      <section className="py-16 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("app.story.newsletter.unsubscribe.page.alternatives.title")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t(
              "app.story.newsletter.unsubscribe.page.alternatives.description",
            )}
          </P>
          <Div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                window.location.href = `/${locale}/newsletter`;
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t(
                "app.story.newsletter.unsubscribe.page.alternatives.subscribe",
              )}
            </Button>
            <Button
              onClick={() => {
                window.location.href = `/${locale}/help`;
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t("app.story.newsletter.unsubscribe.page.alternatives.contact")}
            </Button>
          </Div>
        </Div>
      </section>
    </Div>
  );
}
