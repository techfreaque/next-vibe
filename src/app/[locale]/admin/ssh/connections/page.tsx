import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshConnectionsPageClient } from "./page-client";

interface SshConnectionsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshConnectionsPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshConnectionsPageProps): Promise<SshConnectionsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/ssh/connections`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: SshConnectionsPageData): JSX.Element {
  return <SshConnectionsPageClient locale={locale} user={user} />;
}

export default async function SshConnectionsPage({
  params,
}: SshConnectionsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
