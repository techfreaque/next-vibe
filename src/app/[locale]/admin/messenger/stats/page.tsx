import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailsStatsPageClient } from "./page-client";

interface EmailsStatsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EmailsStatsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: EmailsStatsPageProps): Promise<EmailsStatsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/stats`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: EmailsStatsPageData): JSX.Element {
  return <EmailsStatsPageClient locale={locale} user={user} />;
}

export default async function EmailsStatsPage({
  params,
}: EmailsStatsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
