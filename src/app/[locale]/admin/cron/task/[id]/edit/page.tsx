import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTaskEditPageClient } from "./page-client";

interface CronTaskEditPageProps {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}

export interface CronTaskEditPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: CronTaskEditPageProps): Promise<CronTaskEditPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/tasks`);
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: CronTaskEditPageData): JSX.Element {
  return <CronTaskEditPageClient locale={locale} user={user} id={id} />;
}

export default async function CronTaskEditPage({
  params,
}: CronTaskEditPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
