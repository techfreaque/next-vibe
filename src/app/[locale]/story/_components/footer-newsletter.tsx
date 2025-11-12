"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { H3, P } from "next-vibe-ui/ui/typography";
import { Input } from "next-vibe-ui/ui/input";
import { Check, Send, X } from "next-vibe-ui/ui/icons";
import type { FormEvent, JSX } from "react";

import { useNewsletterManager } from "@/app/api/[locale]/v1/core/newsletter/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import CountrySelector from "../../_components/country-selector";

export function NewsletterSignupFooter({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  const {
    email,
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

  return (
    <Div>
      <Div className="mb-6">
        <H3 className="font-semibold text-lg mb-4">
          {t("app.newsletter.title")}
        </H3>
        <P className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t("app.newsletter.description")}
        </P>

        {/* Email input and action button */}
        <Form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            // Validate email before submission
            if (!email?.includes("@")) {
              return;
            }
            if (isSubscribed) {
              unsubscribe(email);
            } else {
              subscribe(email);
            }
          }}
          className="flex items-center flex flex-row gap-2 mb-3"
        >
          <Input
            type="email"
            placeholder={t("app.newsletter.emailPlaceholder")}
            className="max-w-[220px]"
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={handleEmailChange}
            aria-label={t("app.newsletter.emailPlaceholder")}
            disabled={isAnyOperationInProgress || isLoggedIn}
            name="email"
            id="newsletter-email-footer"
          />

          <Button
            type="submit"
            className={`h-10 w-10 ${
              isSubscribed
                ? showConfirmUnsubscribe
                  ? "bg-red-600 hover:bg-red-700"
                  : "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                : "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
            }`}
            variant={
              isSubscribed && !showConfirmUnsubscribe ? "outline" : "default"
            }
            aria-label={
              isSubscribed
                ? showConfirmUnsubscribe
                  ? t("app.newsletter.subscription.unsubscribe.confirmButton")
                  : t("app.newsletter.subscription.unsubscribe.title")
                : t("app.newsletter.subscribe")
            }
            disabled={isAnyOperationInProgress}
          >
            {isSubmitting || isUnsubscribing ? (
              <Div className="animate-spin">
                <Div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              </Div>
            ) : isSubscribed ? (
              showConfirmUnsubscribe ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </Form>

        {/* Single notification display */}
        {notification && (
          <Div
            className={`text-xs mb-2 ${
              notification.type === "error"
                ? "text-red-600 dark:text-red-400"
                : notification.type === "success"
                  ? "text-green-600 dark:text-green-400"
                  : notification.type === "info"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {t(notification.message)}
          </Div>
        )}
      </Div>

      <Div className="mt-8">
        <H3 className="font-semibold text-lg mb-4">
          {t("app.common.selector.country")} /{" "}
          {t("app.common.selector.language")}
        </H3>
        <Div className="inline-block">
          <CountrySelector locale={locale} />
        </Div>
      </Div>
    </Div>
  );
}
