"use client";

import { Check, Mail, Send, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Input } from "next-vibe-ui/ui/input";
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
  const searchParams = useSearchParams();
  const prefilledLeadId = searchParams.get("leadId") || undefined;

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

  // Track if we've already set the prefilled email and leadId to prevent infinite loops
  const hasSetPrefilledEmail = useRef(false);
  const lastPrefilledEmail = useRef<string | undefined>(undefined);
  const hasSetPrefilledLeadId = useRef(false);
  const lastPrefilledLeadId = useRef<string | undefined>(undefined);
  const [leadId, setLeadId] = React.useState<string | undefined>(
    prefilledLeadId,
  );

  // Set prefilled email and leadId when component mounts
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
    if (
      prefilledLeadId &&
      !hasSetPrefilledLeadId.current &&
      lastPrefilledLeadId.current !== prefilledLeadId
    ) {
      setLeadId(prefilledLeadId);
      hasSetPrefilledLeadId.current = true;
      lastPrefilledLeadId.current = prefilledLeadId;
    }
  }, [prefilledEmail, prefilledLeadId, isLoggedIn, setEmail]);

  return (
    <div className="min-h-screen bg-red-50 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t("app.site.newsletter.unsubscribe.page.title")}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t("app.site.newsletter.unsubscribe.page.subtitle")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {prefilledEmail
              ? t(
                  "app.site.newsletter.unsubscribe.page.emailProvided.description",
                )
              : t("app.site.newsletter.unsubscribe.page.description")}
          </p>

          {/* Unsubscribe Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 max-w-md mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Validate email before submission
                if (!email?.includes("@")) {
                  return;
                }
                unsubscribe(email, leadId);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col space-y-3">
                <Input
                  type="email"
                  placeholder={t("app.site.newsletter.emailPlaceholder")}
                  className="text-center text-lg py-3"
                  autoComplete="email"
                  autoCorrect="off"
                  spellCheck="false"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label={t("app.site.newsletter.emailPlaceholder")}
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
                          "app.site.newsletter.subscription.unsubscribe.confirmButton",
                        )
                      : t(
                          "app.site.newsletter.unsubscribe.page.unsubscribeButton",
                        )
                  }
                  disabled={isAnyOperationInProgress}
                >
                  {isUnsubscribing ? (
                    <div className="animate-spin mr-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    </div>
                  ) : showConfirmUnsubscribe ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <X className="h-5 w-5 mr-2" />
                  )}
                  {showConfirmUnsubscribe
                    ? t(
                        "app.site.newsletter.subscription.unsubscribe.confirmButton",
                      )
                    : t(
                        "app.site.newsletter.unsubscribe.page.unsubscribeButton",
                      )}
                </Button>
              </div>

              {/* Notification display */}
              {notification && (
                <div
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
                </div>
              )}
            </form>

            {/* Subscribe link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("app.site.newsletter.unsubscribe.page.subscribeText")}{" "}
                <a
                  href={`/${locale}/newsletter`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {t("app.site.newsletter.unsubscribe.page.subscribeLink")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-20 px-4 md:px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("app.site.newsletter.unsubscribe.page.info.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t("app.site.newsletter.unsubscribe.page.info.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("app.site.newsletter.unsubscribe.page.info.immediate.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t(
                  "app.site.newsletter.unsubscribe.page.info.immediate.description",
                )}
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t(
                  "app.site.newsletter.unsubscribe.page.info.resubscribe.title",
                )}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t(
                  "app.site.newsletter.unsubscribe.page.info.resubscribe.description",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Actions Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("app.site.newsletter.unsubscribe.page.alternatives.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t("app.site.newsletter.unsubscribe.page.alternatives.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                window.location.href = `/${locale}/newsletter`;
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t("app.site.newsletter.unsubscribe.page.alternatives.subscribe")}
            </Button>
            <Button
              onClick={() => {
                window.location.href = `/${locale}/help`;
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {t("app.site.newsletter.unsubscribe.page.alternatives.contact")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
