import type { Metadata } from "next";
import type { JSX } from "react";

import { UnsubscribePage } from "@/app/api/[locale]/newsletter/unsubscribe/_components/unsubscribe-page";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserProfileRepository } from "@/app/api/[locale]/user/private/me/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    title: t("app.story.newsletter.unsubscribe.page.title"),
    description: t("app.story.newsletter.unsubscribe.page.description"),
    openGraph: {
      title: t("app.story.newsletter.unsubscribe.page.title"),
      description: t("app.story.newsletter.unsubscribe.page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("app.story.newsletter.unsubscribe.page.title"),
      description: t("app.story.newsletter.unsubscribe.page.description"),
    },
  };
}

export default async function NewsletterUnsubscribe({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const authUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Get user email if authenticated and not public
  let prefilledEmail: string | undefined;
  if (!authUser.isPublic) {
    const userProfileResponse = await UserProfileRepository.getProfile(
      authUser,
      locale,
      logger,
    );
    if (userProfileResponse.success && !userProfileResponse.data.isPublic) {
      prefilledEmail = userProfileResponse.data.email;
    }
  }

  return (
    <UnsubscribePage
      locale={locale}
      prefilledEmail={prefilledEmail}
      user={authUser}
    />
  );
}
