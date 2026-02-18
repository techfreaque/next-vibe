/**
 * Campaign Starter Settings Admin Page
 * Interface for managing campaign starter configuration
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignStarterPageClient } from "./page-client";

interface AdminCampaignStarterPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminCampaignStarterPage({
  params,
}: AdminCampaignStarterPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale);

  return <CampaignStarterPageClient locale={locale} user={user} />;
}
