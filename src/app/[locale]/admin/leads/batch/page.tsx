/**
 * Leads Batch Operations Page
 * Server component for batch lead updates
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsBatchPageClient } from "./page-client";

interface LeadsBatchPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface LeadsBatchPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: LeadsBatchPageProps): Promise<LeadsBatchPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/batch`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: LeadsBatchPageData): JSX.Element {
  return <LeadsBatchPageClient locale={locale} user={user} />;
}

export default async function LeadsBatchPage({
  params,
}: LeadsBatchPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
