export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronHistoryPageClient } from "./page-client";

interface CronHistoryPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CronHistoryPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CronHistoryPageProps): Promise<CronHistoryPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/history`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: CronHistoryPageData): JSX.Element {
  return <CronHistoryPageClient locale={locale} user={user} />;
}

export default async function CronHistoryPage({
  params,
}: CronHistoryPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
