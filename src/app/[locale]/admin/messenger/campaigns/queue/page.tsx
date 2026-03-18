/**
 * Campaign Queue Admin Page
 * Shows leads currently active in email campaigns
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignQueueClient } from "./page-client";

interface CampaignQueuePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CampaignQueuePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CampaignQueuePageProps): Promise<CampaignQueuePageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns/queue`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: CampaignQueuePageData): React.JSX.Element {
  return <CampaignQueueClient locale={locale} user={user} />;
}

export default async function CampaignQueuePage({
  params,
}: CampaignQueuePageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
