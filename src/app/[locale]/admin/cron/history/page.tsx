import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronHistoryPageClient } from "./page-client";

export default async function CronHistoryPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/history`);
  return <CronHistoryPageClient locale={locale} user={user} />;
}
