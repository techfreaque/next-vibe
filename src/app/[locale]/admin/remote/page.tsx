import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { RemoteConnectionsPageClient } from "./page-client";

interface RemoteConnectionsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface RemoteConnectionsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: RemoteConnectionsPageProps): Promise<RemoteConnectionsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/remote`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: RemoteConnectionsPageData): JSX.Element {
  return <RemoteConnectionsPageClient locale={locale} user={user} />;
}

export default async function RemoteConnectionsPage({
  params,
}: RemoteConnectionsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
