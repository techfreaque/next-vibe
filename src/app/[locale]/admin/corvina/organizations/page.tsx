export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CorvinaOrganizationsPageClient } from "./page-client";

interface CorvinaOrganizationsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CorvinaOrganizationsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CorvinaOrganizationsPageProps): Promise<CorvinaOrganizationsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/corvina/organizations`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: CorvinaOrganizationsPageData): JSX.Element {
  return <CorvinaOrganizationsPageClient locale={locale} user={user} />;
}

export default async function CorvinaOrganizationsPage({
  params,
}: CorvinaOrganizationsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
