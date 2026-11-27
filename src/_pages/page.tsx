export const dynamic = "force-dynamic";

import { coreEnv } from "next-vibe/core/env";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { canonicalSeoLocale } from "next-vibe/core/i18n/core/seo-locales";
import { VibeMode } from "next-vibe/env/env-util";
import { SetupStatusRepository } from "next-vibe/env/settings/setup-status";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { notFound } from "next-vibe/ui/lib/not-found";
import { permanentRedirect, redirect } from "next-vibe/ui/lib/redirect";

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

  // Guard against bots hitting e.g. /favicon.png which Next.js routes to [locale]
  if (!/^[a-z]{2}-[A-Z]+$/.test(locale)) {
    notFound();
  }

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

  // Fresh self-hosted instance: first-run setup before anything else.
  if (
    SetupStatusRepository.isPending() &&
    (await SetupStatusRepository.shouldRedirectToSetup(
      isAuthenticated && user.roles.includes(UserRole.ADMIN),
    ))
  ) {
    redirect(`/${locale}/setup`);
  }

  // Agent mode only: go straight to chat (no landing page)
  if (coreEnv.NEXT_PUBLIC_VIBE_MODE === VibeMode.AGENT) {
    const defaultFolder = isAuthenticated
      ? DefaultFolderId.PRIVATE
      : DefaultFolderId.INCOGNITO;
    redirect(`/${locale}/threads/${defaultFolder}/new`);
  }

  // Dev and prod: logged-in users go straight to chat
  if (isAuthenticated) {
    redirect(`/${locale}/threads/${DefaultFolderId.PRIVATE}/new`);
  }

  // Bare locale roots consolidate on the canonical locale's story page.
  permanentRedirect(`/${canonicalSeoLocale(locale)}/story`);
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
