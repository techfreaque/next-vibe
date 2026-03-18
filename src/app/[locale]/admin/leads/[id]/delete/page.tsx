/**
 * Lead Delete Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadDeletePageClient } from "./page-client";

interface LeadDeletePageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export interface LeadDeletePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: LeadDeletePageProps): Promise<LeadDeletePageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/leads/${id}/delete`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: LeadDeletePageData): JSX.Element {
  return <LeadDeletePageClient locale={locale} user={user} leadId={id} />;
}

export default async function LeadDeletePage({
  params,
}: LeadDeletePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
