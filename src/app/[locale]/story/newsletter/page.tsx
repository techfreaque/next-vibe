import type { Metadata } from "next";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterPage } from "@/app/api/[locale]/newsletter/subscribe/_components/newsletter-page";
import { userProfileRepository } from "@/app/api/[locale]/user/private/me/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { authRepository } from "@/app/api/[locale]/user/auth/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

interface PageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.story.newsletter.page.title", {
      appName: t("config.appName"),
    }),
    description: t("app.story.newsletter.page.description"),
    openGraph: {
      title: t("app.story.newsletter.page.title", {
        appName: t("config.appName"),
      }),
      description: t("app.story.newsletter.page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("app.story.newsletter.page.title", {
        appName: t("config.appName"),
      }),
      description: t("app.story.newsletter.page.description"),
    },
  };
}

export default async function Newsletter({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale } = await params;
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

  return <NewsletterPage locale={locale} user={user} />;
}
