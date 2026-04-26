/**
 * Cortex Page
 * Standalone page for browsing and managing the user's cortex (persistent AI memory).
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { CortexPageClient } from "./page-client";

interface CortexPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CortexPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CortexPageProps): Promise<CortexPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, user };
}

export function TanstackPage({ locale, user }: CortexPageData): JSX.Element {
  return <CortexPageClient locale={locale} user={user} />;
}

export default async function CortexPage({
  params,
}: CortexPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
