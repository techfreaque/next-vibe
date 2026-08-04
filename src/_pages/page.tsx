export const dynamic = "force-dynamic";

import { coreEnv } from "next-vibe/core/env";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { VibeMode } from "next-vibe/env/env-util";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { redirect } from "next-vibe/ui/lib/redirect";

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

  // Agent mode only: go straight to chat (no landing page)
  if (coreEnv.NEXT_PUBLIC_VIBE_MODE === VibeMode.AGENT) {
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
 * - Agent mode: redirects to chat (threads)
 * - Cloud/dev mode: redirects to story page
 */
export default async function HomePage({
  params,
}: ChatPageProps): Promise<never> {
  return tanstackLoader({ params });
}
