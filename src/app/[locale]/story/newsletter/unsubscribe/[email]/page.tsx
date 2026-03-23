export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next-vibe-ui/lib/not-found";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UnsubscribePage } from "../_components/unsubscribe-page";

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
    title: t("app.story.newsletter.unsubscribe.page.emailProvided.title"),
    description: t(
      "app.story.newsletter.unsubscribe.page.emailProvided.description",
    ),
    openGraph: {
      title: t("app.story.newsletter.unsubscribe.page.emailProvided.title"),
      description: t(
        "app.story.newsletter.unsubscribe.page.emailProvided.description",
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("app.story.newsletter.unsubscribe.page.emailProvided.title"),
      description: t(
        "app.story.newsletter.unsubscribe.page.emailProvided.description",
      ),
    },
  };
}

export interface NewsletterUnsubscribeWithEmailPageData {
  locale: CountryLanguage;
  decodedEmail: string;
  authUser: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: PageProps): Promise<NewsletterUnsubscribeWithEmailPageData> {
  const { locale, email } = await params;

  const logger = createEndpointLogger(false, Date.now(), locale);
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

  return { locale, decodedEmail, authUser };
}

export function TanstackPage({
  locale,
  decodedEmail,
  authUser,
}: NewsletterUnsubscribeWithEmailPageData): JSX.Element {
  return (
    <UnsubscribePage
      locale={locale}
      prefilledEmail={decodedEmail}
      user={authUser}
    />
  );
}

export default async function NewsletterUnsubscribeWithEmail({
  params,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
