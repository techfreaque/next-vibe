export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { scopedTranslation } from "../../i18n";
import { UnsubscribePageClient } from "../page-client";

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
  const { t } = scopedTranslation.scopedT(locale);

  // Validate email parameter
  if (!isValidEmail(email)) {
    return {
      title: t("page.invalidEmail.title"),
      description: t("page.invalidEmail.description"),
    };
  }

  return {
    title: t("unsubscribe.page.emailProvided.title"),
    description: t("unsubscribe.page.emailProvided.description"),
    openGraph: {
      title: t("unsubscribe.page.emailProvided.title"),
      description: t("unsubscribe.page.emailProvided.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("unsubscribe.page.emailProvided.title"),
      description: t("unsubscribe.page.emailProvided.description"),
    },
  };
}

export interface NewsletterUnsubscribeWithEmailPageData {
  locale: CountryLanguage;
  decodedEmail: string;
  authUser: JwtPayloadType;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: PageProps): Promise<NewsletterUnsubscribeWithEmailPageData> {
  const { locale, email } = await params;

  const logger = createEndpointLogger(false, locale);
  const authUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Decode the email parameter
  const decodedEmail = decodeURIComponent(email);

  // Validate email parameter
  if (!isValidEmail(decodedEmail)) {
    notFound();
  }

  return { locale, decodedEmail, authUser, platform: Platform.NEXT_PAGE };
}

export function TanstackPage({
  locale,
  decodedEmail,
  authUser,
  platform,
}: NewsletterUnsubscribeWithEmailPageData): JSX.Element {
  return (
    <UnsubscribePageClient
      locale={locale}
      user={authUser}
      prefilledEmail={decodedEmail}
      platform={platform}
    />
  );
}

export default async function NewsletterUnsubscribeWithEmail({
  params,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
