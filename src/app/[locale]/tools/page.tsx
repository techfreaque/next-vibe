/**
 * AI Tools Page
 * Standalone page for managing AI tool configuration.
 * Same content as the modal, but as a full page with back navigation.
 */

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { ToolsPageClient } from "./page-client";

interface ToolsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function ToolsPage({
  params,
}: ToolsPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return <ToolsPageClient locale={locale} user={user} />;
}
