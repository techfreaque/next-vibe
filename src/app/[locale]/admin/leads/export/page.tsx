/**
 * Leads Export Page
 * Server component for leads CSV/Excel export
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsExportPageClient } from "./page-client";

interface LeadsExportPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface LeadsExportPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: LeadsExportPageProps): Promise<LeadsExportPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/export`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: LeadsExportPageData): JSX.Element {
  return <LeadsExportPageClient locale={locale} user={user} />;
}

export default async function LeadsExportPage({
  params,
}: LeadsExportPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
