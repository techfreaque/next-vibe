export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { JSX } from "react";

import { configScopedTranslation } from "@/i18n";
import { scopedTranslation as meScopedTranslation } from "@/user/private/me/i18n";
import { UserProfileRepository } from "@/user/private/me/repository";

import { NewsletterPage } from "./_components/newsletter-page";
import { scopedTranslation } from "./i18n";

interface PageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return {
    title: t("page.title", {
      appName: configT("appName"),
    }),
    description: t("page.description"),
    openGraph: {
      title: t("page.title", {
        appName: configT("appName"),
      }),
      description: t("page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("page.title", {
        appName: configT("appName"),
      }),
      description: t("page.description"),
    },
  };
}

export interface NewsletterPageData {
  locale: CountryLanguage;
  authUser: JwtPayloadType;
  userEmail: string | undefined;
}

export async function tanstackLoader({
  params,
}: PageProps): Promise<NewsletterPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);
  const authUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Get user email if authenticated and not public
  let userEmail: string | undefined;
  if (!authUser.isPublic) {
    const { t } = meScopedTranslation.scopedT(locale);
    const userProfileResponse = await UserProfileRepository.getProfile(
      authUser,
      locale,
      logger,
      t,
    );
    if (userProfileResponse.success && !userProfileResponse.data.isPublic) {
      userEmail = userProfileResponse.data.email;
    }
  }

  return { locale, authUser, userEmail };
}

export function TanstackPage({
  locale,
  authUser,
  userEmail,
}: NewsletterPageData): JSX.Element {
  return (
    <NewsletterPage locale={locale} user={authUser} userEmail={userEmail} />
  );
}

export default async function Newsletter({
  params,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
