/**
 * Threads Root Page
 * Shows all folders - redirects to first folder
 */

export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

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
  const logger = createEndpointLogger(false, Date.now(), locale);
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
