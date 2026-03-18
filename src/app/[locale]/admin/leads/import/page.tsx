/**
 * Leads Import Page
 * Upload CSV files and monitor import job status
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsImportPageClient } from "./page-client";

interface LeadsImportPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface LeadsImportPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: LeadsImportPageProps): Promise<LeadsImportPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/import`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: LeadsImportPageData): JSX.Element {
  return <LeadsImportPageClient locale={locale} user={user} />;
}

export default async function LeadsImportPage({
  params,
}: LeadsImportPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
