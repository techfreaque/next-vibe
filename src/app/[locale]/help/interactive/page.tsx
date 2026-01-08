/**
 * Help Interactive Page
 * Interactive mode for CLI - shows info message on web
 */

import { notFound } from "next-vibe-ui/lib/not-found";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX } from "react";

import { HelpInteractiveView } from "@/app/api/[locale]/system/help/interactive/_components/help-interactive-view";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

interface HelpInteractivePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function HelpInteractivePage({
  params,
}: HelpInteractivePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  if (env.NODE_ENV === "production") {
    notFound();
  }
  const logger = createEndpointLogger(false, Date.now(), locale);

  const minimalUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.ADMIN, UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  return (
    <PageLayout scrollable={true}>
      <HelpInteractiveView locale={locale} user={minimalUser} />
    </PageLayout>
  );
}
