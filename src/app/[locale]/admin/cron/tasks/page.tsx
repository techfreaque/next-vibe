import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTasksPageClient } from "./page-client";

interface CronTasksPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CronTasksPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CronTasksPageProps): Promise<CronTasksPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/tasks`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: CronTasksPageData): JSX.Element {
  return <CronTasksPageClient locale={locale} user={user} />;
}

export default async function CronTasksPage({
  params,
}: CronTasksPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
