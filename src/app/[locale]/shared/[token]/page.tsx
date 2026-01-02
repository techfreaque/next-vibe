/**
 * Public share link access route
 * Handles accessing threads via share tokens
 * URL format: /{locale}/shared/{token}
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { ShareLinksRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SharedTokenPageProps {
  params: Promise<{
    locale: CountryLanguage;
    token: string;
  }>;
}

export default async function SharedTokenPage({
  params,
}: SharedTokenPageProps): Promise<JSX.Element> {
  const { locale, token } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { t } = simpleT(locale);

  // Get current user (could be public or authenticated)
  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );

  const user = userResponse.success ? userResponse.data : undefined;
  if (!user) {
    return (
      <Div className="flex items-center justify-center min-h-screen p-4">
        <Div className="max-w-md text-center">
          <P className="text-lg font-semibold mb-2">{t("app.shared.error.title")}</P>
          <P className="text-sm text-muted-foreground">{t("app.shared.error.userError")}</P>
        </Div>
      </Div>
    );
  }

  // Get share link by token
  const shareLinkResponse = await ShareLinksRepository.getByToken(token, logger);

  if (!shareLinkResponse.success || !shareLinkResponse.data) {
    return (
      <Div className="flex items-center justify-center min-h-screen p-4">
        <Div className="max-w-md text-center">
          <P className="text-lg font-semibold mb-2">{t("app.shared.error.title")}</P>
          <P className="text-sm text-muted-foreground">
            {shareLinkResponse.message || t("app.shared.error.invalidToken")}
          </P>
        </Div>
      </Div>
    );
  }

  const { thread, shareLink } = shareLinkResponse.data;

  // Check if authentication is required but user is not authenticated
  if (shareLink.requireAuth && user.isPublic) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(`/${locale}/shared/${token}`);
    redirect(`/${locale}/user/auth?returnUrl=${returnUrl}`);
  }

  // Redirect to the actual thread
  // Format: /{locale}/threads/shared/{threadId}
  redirect(`/${locale}/threads/shared/${thread.id}`);
}
