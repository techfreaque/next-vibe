/**
 * Public share link access route
 * Handles accessing threads via share tokens
 * URL format: /{locale}/shared/{token}
 */

export const dynamic = "force-dynamic";

import type { Route } from "next";
import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { scopedTranslation as shareLinksScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/i18n";
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

type SharedTokenPageState =
  | { kind: "userError"; errorTitle: string; errorMessage: string }
  | { kind: "shareLinkError"; errorTitle: string; errorMessage: string }
  | { kind: "redirect"; url: Route };

export interface SharedTokenPageData {
  locale: CountryLanguage;
  state: SharedTokenPageState;
}

export async function tanstackLoader({
  params,
}: SharedTokenPageProps): Promise<SharedTokenPageData> {
  const { locale, token } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { t } = simpleT(locale);
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
        errorTitle: t("app.common.error.title"),
        errorMessage: t("app.common.error.message"),
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
        errorTitle: t("app.common.error.title"),
        errorMessage:
          shareLinkResponse.message ?? t("app.common.error.message"),
      },
    };
  }

  const { thread, shareLink } = shareLinkResponse.data;

  // Check if authentication is required but user is not authenticated
  if (shareLink.requireAuth && user.isPublic) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(`/${locale}/shared/${token}`);
    return {
      locale,
      state: {
        kind: "redirect",
        url: `/${locale}/user/auth?returnUrl=${returnUrl}`,
      },
    };
  }

  // Redirect to the actual thread
  // Format: /{locale}/threads/shared/{threadId}
  return {
    locale,
    state: { kind: "redirect", url: `/${locale}/threads/shared/${thread.id}` },
  };
}

export function TanstackPage({ state }: SharedTokenPageData): JSX.Element {
  if (state.kind === "redirect") {
    redirect(state.url);
  }

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
