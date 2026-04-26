/**
 * Public share link access route
 * Handles accessing threads via share tokens
 * URL format: /{locale}/shared/{token}
 */

export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { scopedTranslation } from "@/app/[locale]/shared/i18n";
import { scopedTranslation as shareLinksScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/i18n";
import { ShareLinksRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

interface SharedTokenPageProps {
  params: Promise<{
    locale: CountryLanguage;
    token: string;
  }>;
}

type SharedTokenPageState =
  | { kind: "userError"; errorTitle: string; errorMessage: string }
  | { kind: "shareLinkError"; errorTitle: string; errorMessage: string };

export interface SharedTokenPageData {
  locale: CountryLanguage;
  state: SharedTokenPageState;
}

export async function tanstackLoader({
  params,
}: SharedTokenPageProps): Promise<SharedTokenPageData> {
  const { locale, token } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { t } = scopedTranslation.scopedT(locale);
  const { t: shareLinksT } = shareLinksScopedTranslation.scopedT(locale);

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
    return {
      locale,
      state: {
        kind: "userError",
        errorTitle: t("error.title"),
        errorMessage: t("error.message"),
      },
    };
  }

  // Get share link by token
  const shareLinkResponse = await ShareLinksRepository.getByToken(
    token,
    shareLinksT,
    logger,
  );

  if (!shareLinkResponse.success || !shareLinkResponse.data) {
    return {
      locale,
      state: {
        kind: "shareLinkError",
        errorTitle: t("error.title"),
        errorMessage: shareLinkResponse.message ?? t("error.message"),
      },
    };
  }

  const { thread, shareLink } = shareLinkResponse.data;

  // Check if authentication is required but user is not authenticated
  if (shareLink.requireAuth && user.isPublic) {
    const returnUrl = encodeURIComponent(`/${locale}/shared/${token}`);
    redirect(`/${locale}/user/auth?returnUrl=${returnUrl}`);
  }

  redirect(`/${locale}/threads/shared/${thread.id}`);
}

export function TanstackPage({ state }: SharedTokenPageData): JSX.Element {
  return (
    <Div className="flex items-center justify-center min-h-screen p-4">
      <Div className="max-w-md text-center">
        <P className="text-lg font-semibold mb-2">{state.errorTitle}</P>
        <P className="text-sm text-muted-foreground">{state.errorMessage}</P>
      </Div>
    </Div>
  );
}

export default async function SharedTokenPage({
  params,
}: SharedTokenPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
