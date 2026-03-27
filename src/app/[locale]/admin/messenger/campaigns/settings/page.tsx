/**
 * Campaign Starter Settings Admin Page
 * Interface for managing campaign starter configuration
 */

export const dynamic = "force-dynamic";

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignStarterPageClient } from "./page-client";

interface AdminCampaignStarterPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface AdminCampaignStarterPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: AdminCampaignStarterPageProps): Promise<AdminCampaignStarterPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: AdminCampaignStarterPageData): React.JSX.Element {
  return <CampaignStarterPageClient locale={locale} user={user} />;
}

export default async function AdminCampaignStarterPage({
  params,
}: AdminCampaignStarterPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
