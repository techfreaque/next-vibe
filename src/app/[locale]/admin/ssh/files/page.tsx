import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshFilesPageClient } from "./page-client";

interface SshFilesPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshFilesPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshFilesPageProps): Promise<SshFilesPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/ssh/files`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: SshFilesPageData): JSX.Element {
  return <SshFilesPageClient locale={locale} user={user} />;
}

export default async function SshFilesPage({
  params,
}: SshFilesPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
