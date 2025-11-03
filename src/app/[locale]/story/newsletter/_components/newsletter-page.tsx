"use client";

import { Check, Mail, Send, TrendingUp, Users, X, Zap } from "lucide-react";
import Link from "next/link";
import { Form } from "next-vibe-ui/ui/form/form";
import { Button } from "next-vibe-ui/ui/button";
import { Input } from "next-vibe-ui/ui/input";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

import { useNewsletterManager } from "@/app/api/[locale]/v1/core/newsletter/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface NewsletterPageProps {
  locale: CountryLanguage;
  prefilledEmail?: string;
}

export function NewsletterPage({
  locale,
  prefilledEmail,
}: NewsletterPageProps): JSX.Element {
  const { t } = simpleT(locale);

  const {
    email,
    setEmail,
    isLoggedIn,
    isSubmitting,
    isUnsubscribing,
    isAnyOperationInProgress,
    notification,
    showConfirmUnsubscribe,
    subscribe,
    unsubscribe,
    isSubscribed,
    handleEmailChange,
  } = useNewsletterManager();

  // Track if we've already set the prefilled email to prevent infinite loops
  const hasSetPrefilledEmail = useRef(false);
  const lastPrefilledEmail = useRef<string | undefined>(undefined);

  // Set prefilled email when component mounts
  useEffect(() => {
    if (
      prefilledEmail !== undefined &&
      prefilledEmail.length > 0 &&
      !isLoggedIn &&
      !hasSetPrefilledEmail.current &&
      lastPrefilledEmail.current !== prefilledEmail
    ) {
      setEmail(prefilledEmail);
      hasSetPrefilledEmail.current = true;
      lastPrefilledEmail.current = prefilledEmail;
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledEmail, isLoggedIn]);

  const benefits = [
    {
      icon: TrendingUp,
      title: t("app.story.newsletter.page.benefits.benefit1.title"),
      description: t("app.story.newsletter.page.benefits.benefit1.description"),
    },
    {
      icon: Zap,
      title: t("app.story.newsletter.page.benefits.benefit2.title"),
      description: t("app.story.newsletter.page.benefits.benefit2.description"),
    },
    {
      icon: Mail,
      title: t("app.story.newsletter.page.benefits.benefit3.title"),
      description: t("app.story.newsletter.page.benefits.benefit3.description"),
    },
    {
      icon: Users,
      title: t("app.story.newsletter.page.benefits.benefit4.title"),
      description: t("app.story.newsletter.page.benefits.benefit4.description"),
    },
  ];

  return (
    <Div className="min-h-screen bg-blue-50 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {prefilledEmail !== undefined && prefilledEmail.length > 0
              ? t("app.story.newsletter.page.emailProvided.title")
              : t("app.story.newsletter.page.title")}
          </H1>
          <H2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t("app.story.newsletter.page.subtitle")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {prefilledEmail !== undefined && prefilledEmail.length > 0
              ? t("app.story.newsletter.page.emailProvided.description")
              : t("app.story.newsletter.page.heroDescription")}
          </P>

          {/* Newsletter Form */}
          <Div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 max-w-md mx-auto">
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                // Validate email before submission
                if (!email.includes("@")) {
                  return;
                }
                if (isSubscribed) {
                  unsubscribe(email);
                } else {
                  subscribe(email);
                }
              }}
              className="space-y-4"
            >
              <div className="flex flex-col space-y-3">
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
                  id="newsletter-email-page"
                />

                <Button
                  type="submit"
                  className={`py-3 text-lg font-semibold ${
                    isSubscribed
                      ? showConfirmUnsubscribe
                        ? "bg-red-600 hover:bg-red-700"
                        : "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      : "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
                  }`}
                  variant={
                    isSubscribed && !showConfirmUnsubscribe
                      ? "outline"
                      : "default"
                  }
                  aria-label={
                    isSubscribed
                      ? showConfirmUnsubscribe
                        ? t(
                            "app.story.newsletter.subscription.unsubscribe.confirmButton",
                          )
                        : t(
                            "app.story.newsletter.subscription.unsubscribe.title",
                          )
                      : t("app.story.newsletter.page.cta.subscribeButton")
                  }
                  disabled={isAnyOperationInProgress}
                >
                  {isSubmitting || isUnsubscribing ? (
                    <div className="animate-spin mr-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    </div>
                  ) : isSubscribed ? (
                    showConfirmUnsubscribe ? (
                      <Check className="h-5 w-5 mr-2" />
                    ) : (
                      <X className="h-5 w-5 mr-2" />
                    )
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isSubscribed
                    ? showConfirmUnsubscribe
                      ? t(
                          "app.story.newsletter.subscription.unsubscribe.confirmButton",
                        )
                      : t("app.story.newsletter.subscription.unsubscribe.title")
                    : t("app.story.newsletter.page.cta.subscribeButton")}
                </Button>
              </div>

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

            {/* Unsubscribe link */}
            <Div className="text-center mt-4">
              <P className="text-sm text-gray-500 dark:text-gray-400">
                {t("app.story.newsletter.page.unsubscribeText")}{" "}
                <Link
                  href={`/${locale}/story/newsletter/unsubscribe`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {t("app.story.newsletter.page.unsubscribeLink")}
                </Link>
              </P>
            </Div>
          </Div>
        </Div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 bg-white dark:bg-gray-800">
        <Div className="container mx-auto max-w-6xl">
          <Div className="text-center mb-16">
            <H2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("app.story.newsletter.page.benefits.title")}
            </H2>
            <P className="text-lg text-gray-600 dark:text-gray-400">
              {t("app.story.newsletter.page.benefits.subtitle")}
            </P>
          </Div>

          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Div
                  key={`benefit_${index}_${benefit.title}`}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow"
                >
                  <Div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </Div>
                  <H3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </H3>
                  <P className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </P>
                </Div>
              );
            })}
          </Div>
        </Div>
      </section>

      {/* Frequency Section */}
      <section className="py-16 px-4 md:px-6">
        <Div className="container mx-auto max-w-4xl text-center">
          <H2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("app.story.newsletter.page.frequency.title")}
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.story.newsletter.page.frequency.description")}
          </P>
        </Div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600">
        <Div className="container mx-auto max-w-4xl text-center text-white">
          <H2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("app.story.newsletter.page.cta.title")}
          </H2>
          <P className="text-xl mb-8 opacity-90">
            {t("app.story.newsletter.page.cta.description")}
          </P>
          <Button
            onClick={() => {
              // Scroll to top form
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            variant="secondary"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            {t("app.story.newsletter.page.cta.subscribeButton")}
          </Button>
        </Div>
      </section>
    </Div>
  );
}
