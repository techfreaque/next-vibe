export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { redirect } from "next-vibe/ui/web/lib/redirect";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { env } from "@/config/env";

interface ChatPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface HomePageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: ChatPageProps): Promise<never> {
  const { locale } = await params;

  // In local mode, go straight to chat
  if (env.NEXT_PUBLIC_LOCAL_MODE) {
    const logger = createEndpointLogger(false, locale);
    const userResponse = await UserRepository.getUserByAuth(
      {
        detailLevel: UserDetailLevel.MINIMAL,
        roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
      },
      locale,
      logger,
    );
    const user = userResponse.success ? userResponse.data : undefined;
    const isAuthenticated = user !== undefined && !user.isPublic;
    const defaultFolder = isAuthenticated
      ? DefaultFolderId.PRIVATE
      : DefaultFolderId.INCOGNITO;
    redirect(`/${locale}/threads/${defaultFolder}`);
  }

  // Dev and prod: check auth - logged-in users go straight to chat
  const logger = createEndpointLogger(false, locale);
  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );
  const user = userResponse.success ? userResponse.data : undefined;
  const isAuthenticated = user !== undefined && !user.isPublic;

  if (isAuthenticated) {
    redirect(`/${locale}/threads/${DefaultFolderId.PRIVATE}`);
  }

  redirect(`/${locale}/story`);
}

export function TanstackPage(): never {
  return null as never;
}

/**
 * Root homepage.
 * - Local mode (vibe start): redirects to chat (threads)
 * - All other modes (dev/prod): redirects to story page
 */
export default async function HomePage({
  params,
}: ChatPageProps): Promise<never> {
  return tanstackLoader({ params });
}
