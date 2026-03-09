/**
 * Campaign Queue Admin Page
 * Shows leads currently active in email campaigns
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignQueueClient } from "./page-client";

interface CampaignQueuePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function CampaignQueuePage({
  params,
}: CampaignQueuePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/email-campaigns/queue`,
  );

  return <CampaignQueueClient locale={locale} user={user} />;
}
