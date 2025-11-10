import type { Metadata } from "next";
import type { JSX } from "react";
import { notFound } from "next-vibe-ui/lib/not-found";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterPage } from "../_components/newsletter-page";

interface PageProps {
  params: Promise<{
    locale: CountryLanguage;
    email: string;
  }>;
}

// Simple email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(decodeURIComponent(email));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, email } = await params;
  const { t } = simpleT(locale);

  // Validate email parameter
  if (!isValidEmail(email)) {
    return {
      title: t("app.story.newsletter.page.invalidEmail.title"),
      description: t("app.story.newsletter.page.invalidEmail.description"),
    };
  }

  return {
    title: t("app.story.newsletter.page.emailProvided.title"),
    description: t("app.story.newsletter.page.emailProvided.description"),
    openGraph: {
      title: t("app.story.newsletter.page.emailProvided.title"),
      description: t("app.story.newsletter.page.emailProvided.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("app.story.newsletter.page.emailProvided.title"),
      description: t("app.story.newsletter.page.emailProvided.description"),
    },
  };
}

export default async function NewsletterWithEmail({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale, email } = await params;

  // Decode the email parameter
  const decodedEmail = decodeURIComponent(email);

  // Validate email parameter
  if (!isValidEmail(decodedEmail)) {
    notFound();
  }

  return <NewsletterPage locale={locale} prefilledEmail={decodedEmail} />;
}
