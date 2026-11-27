export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
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
  const appName = configT("appName");
  const title = t("page.title", { appName });

  return metadataGenerator(locale, {
    path: "story/newsletter",
    title,
    category: t("page.eyebrow", { appName }),
    description: t("page.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "")}/og-image.jpg`,
    imageAlt: title,
    keywords: [t("page.eyebrow", { appName })],
  });
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
