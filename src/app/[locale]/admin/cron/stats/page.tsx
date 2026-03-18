import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronStatsPageClient } from "./page-client";

interface CronStatsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CronStatsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CronStatsPageProps): Promise<CronStatsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/stats`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: CronStatsPageData): JSX.Element {
  return <CronStatsPageClient locale={locale} user={user} />;
}

export default async function CronStatsPage({
  params,
}: CronStatsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
