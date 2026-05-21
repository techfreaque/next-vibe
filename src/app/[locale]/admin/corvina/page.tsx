export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CorvinaOrganizationsPageClient } from "./organizations/page-client";

interface CorvinaPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CorvinaPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CorvinaPageProps): Promise<CorvinaPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/corvina`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: CorvinaPageData): JSX.Element {
  return <CorvinaOrganizationsPageClient locale={locale} user={user} />;
}

export default async function CorvinaPage({
  params,
}: CorvinaPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
