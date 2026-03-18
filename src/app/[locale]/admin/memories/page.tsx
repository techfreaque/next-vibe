import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MemoriesAdminPageClient } from "./page-client";

interface MemoriesAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MemoriesAdminPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MemoriesAdminPageProps): Promise<MemoriesAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/memories`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: MemoriesAdminPageData): JSX.Element {
  return <MemoriesAdminPageClient locale={locale} user={user} />;
}

export default async function MemoriesAdminPage({
  params,
}: MemoriesAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
