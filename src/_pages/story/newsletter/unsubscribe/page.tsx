export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { scopedTranslation as meScopedTranslation } from "@/user/private/me/i18n";
import { UserProfileRepository } from "@/user/private/me/repository";

import { scopedTranslation } from "../i18n";
import { UnsubscribePageClient } from "./page-client";

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

  return {
    title: t("unsubscribe.page.title"),
    description: t("unsubscribe.page.description"),
    openGraph: {
      title: t("unsubscribe.page.title"),
      description: t("unsubscribe.page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("unsubscribe.page.title"),
      description: t("unsubscribe.page.description"),
    },
  };
}

export interface NewsletterUnsubscribePageData {
  locale: CountryLanguage;
  authUser: JwtPayloadType;
  prefilledEmail: string | undefined;
}

export async function tanstackLoader({
  params,
}: PageProps): Promise<NewsletterUnsubscribePageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);
  const authUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // The JWT carries no email — fetch it from the profile so a logged-in user's
  // unsubscribe form comes pre-filled. Seeded into the widget via autoPrefillData.
  let prefilledEmail: string | undefined;
  if (!authUser.isPublic) {
    const { t } = meScopedTranslation.scopedT(locale);
    const profile = await UserProfileRepository.getProfile(
      authUser,
      locale,
      logger,
      t,
    );
    if (profile.success && !profile.data.isPublic) {
      prefilledEmail = profile.data.email;
    }
  }

  return { locale, authUser, prefilledEmail };
}

export function TanstackPage({
  locale,
  authUser,
  prefilledEmail,
}: NewsletterUnsubscribePageData): JSX.Element {
  return (
    <UnsubscribePageClient
      locale={locale}
      user={authUser}
      prefilledEmail={prefilledEmail}
    />
  );
}

export default async function NewsletterUnsubscribe({
  params,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
