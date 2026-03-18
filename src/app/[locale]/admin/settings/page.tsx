import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SettingsPageClient } from "./page-client";

interface SettingsAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SettingsAdminPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SettingsAdminPageProps): Promise<SettingsAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/settings`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: SettingsAdminPageData): JSX.Element {
  return <SettingsPageClient locale={locale} user={user} />;
}

export default async function SettingsAdminPage({
  params,
}: SettingsAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
