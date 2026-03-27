export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronQueuePageClient } from "./page-client";

interface CronQueuePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CronQueuePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CronQueuePageProps): Promise<CronQueuePageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/queue`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: CronQueuePageData): JSX.Element {
  return <CronQueuePageClient locale={locale} user={user} />;
}

export default async function CronQueuePage({
  params,
}: CronQueuePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
