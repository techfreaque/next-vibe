export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { scopedTranslation as meScopedTranslation } from "@/app/api/[locale]/user/private/me/i18n";
import { UserProfileRepository } from "@/app/api/[locale]/user/private/me/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation } from "./i18n";

import { NewsletterPage } from "./_components/newsletter-page";

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
  const logger = createEndpointLogger(false, Date.now(), locale);
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
