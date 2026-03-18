import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { EndpointsAdminPageClient } from "./page-client";

interface EndpointsAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EndpointsAdminPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: EndpointsAdminPageProps): Promise<EndpointsAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/endpoints`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: EndpointsAdminPageData): JSX.Element {
  return <EndpointsAdminPageClient locale={locale} user={user} />;
}

export default async function EndpointsAdminPage({
  params,
}: EndpointsAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
