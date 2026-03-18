/**
 * Lead Create Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadCreatePageClient } from "./page-client";

interface LeadCreatePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface LeadCreatePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: LeadCreatePageProps): Promise<LeadCreatePageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/create`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: LeadCreatePageData): JSX.Element {
  return <LeadCreatePageClient locale={locale} user={user} />;
}

export default async function LeadCreatePage({
  params,
}: LeadCreatePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
