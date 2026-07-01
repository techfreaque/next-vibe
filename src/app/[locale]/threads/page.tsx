/**
 * Threads Root Page
 * Shows all folders - redirects to first folder
 */

export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { redirect } from "next-vibe/ui/web/lib/redirect";
import type { JSX } from "react";

import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";

interface ThreadsRootPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ThreadsRootPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: ThreadsRootPageProps): Promise<never> {
  const { locale } = await params;
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
  const folder = user?.isPublic ? "incognito" : "private";
  redirect(`/${locale}/threads/${folder}`);
}

export function TanstackPage(): JSX.Element {
  return null as never;
}

export default async function ThreadsRootPage({
  params,
}: ThreadsRootPageProps): Promise<never> {
  return tanstackLoader({ params });
}
