/**
 * Lead Detail Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadDetailPageClient } from "./page-client";

interface LeadDetailPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export interface LeadDetailPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: LeadDetailPageProps): Promise<LeadDetailPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/${id}`);
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: LeadDetailPageData): JSX.Element {
  return <LeadDetailPageClient locale={locale} user={user} leadId={id} />;
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
