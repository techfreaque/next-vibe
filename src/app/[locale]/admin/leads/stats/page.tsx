/**
 * Leads Stats Page
 * Server component for leads statistics and analytics
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";
import { LeadsStatsClient } from "./leads-stats-client";

interface LeadsStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface LeadsStatsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function generateMetadata({
  params,
}: LeadsStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);

  return {
    title: t("title"),
    description: t("description"),
  };
}

export async function tanstackLoader({
  params,
}: LeadsStatsPageProps): Promise<LeadsStatsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/stats`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: LeadsStatsPageData): React.JSX.Element {
  return <LeadsStatsClient locale={locale} user={user} />;
}

export default async function LeadsStatsPage({
  params,
}: LeadsStatsPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
