import type { Metadata } from "next";
import type { JSX } from "react";
import { notFound } from "next-vibe-ui/lib/not-found";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterPage } from "@/app/api/[locale]/newsletter/subscribe/_components/newsletter-page";
import { userProfileRepository } from "@/app/api/[locale]/user/private/me/repository";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { authRepository } from "@/app/api/[locale]/user/auth/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
  const logger = createEndpointLogger(false, Date.now(), locale);
  const authUser = await authRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  const userResponse = authUser
    ? await userProfileRepository.getProfile(authUser, locale, logger)
    : undefined;

  const user = userResponse?.success ? userResponse.data : undefined;

  // Decode the email parameter
  const decodedEmail = decodeURIComponent(email);

  // Validate email parameter
  if (!isValidEmail(decodedEmail)) {
    notFound();
  }

  return (
    <NewsletterPage locale={locale} prefilledEmail={decodedEmail} user={user} />
  );
}
