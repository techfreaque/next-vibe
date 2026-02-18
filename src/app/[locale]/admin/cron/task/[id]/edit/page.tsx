import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTaskEditPageClient } from "./page-client";

export default async function CronTaskEditPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/cron/tasks`);
  return <CronTaskEditPageClient locale={locale} user={user} id={id} />;
}
