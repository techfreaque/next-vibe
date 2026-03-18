import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronStatsPageClient } from "./stats/page-client";

interface CronAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CronAdminPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CronAdminPageProps): Promise<CronAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/tasks`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: CronAdminPageData): JSX.Element {
  return <CronStatsPageClient locale={locale} user={user} />;
}

export default async function CronAdminPage({
  params,
}: CronAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
