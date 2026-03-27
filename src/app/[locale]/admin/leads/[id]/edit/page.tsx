/**
 * Lead Edit Page
 * Server component for authentication + client EndpointsPage rendering
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadEditPageClient } from "./page-client";

interface LeadEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export interface LeadEditPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: LeadEditPageProps): Promise<LeadEditPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/leads/${id}/edit`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: LeadEditPageData): JSX.Element {
  return <LeadEditPageClient locale={locale} user={user} leadId={id} />;
}

export default async function LeadEditPage({
  params,
}: LeadEditPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
