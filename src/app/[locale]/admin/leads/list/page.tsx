/**
 * Leads List Page
 * Uses EndpointsPage component for complete endpoint handling
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsListClient } from "./leads-list-client";

interface LeadsListPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface LeadsListPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: LeadsListPageProps): Promise<LeadsListPageData> {
  const { locale } = await params;
  // Require admin user authentication
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/list`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: LeadsListPageData): JSX.Element {
  return <LeadsListClient locale={locale} user={user} />;
}

export default async function LeadsListPage({
  params,
}: LeadsListPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
