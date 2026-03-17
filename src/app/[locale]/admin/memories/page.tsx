import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { MemoriesAdminPageClient } from "./page-client";

export default async function MemoriesAdminPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/memories`);
  return <MemoriesAdminPageClient locale={locale} user={user} />;
}
