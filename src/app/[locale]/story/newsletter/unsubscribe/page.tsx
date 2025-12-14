import type { Metadata } from "next";
import type { JSX } from "react";

import { UnsubscribePage } from "@/app/api/[locale]/newsletter/unsubscribe/_components/unsubscribe-page";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { authRepository } from "@/app/api/[locale]/user/auth/repository";
import { userProfileRepository } from "@/app/api/[locale]/user/private/me/repository";
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
  const authUser = await authRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  const userResponse = authUser
    ? await userProfileRepository.getProfile(authUser, locale, logger)
    : undefined;

  const user = userResponse?.success ? userResponse.data : undefined;

  return (
    <UnsubscribePage locale={locale} prefilledEmail={undefined} user={user} />
  );
}
