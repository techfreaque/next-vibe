/**
 * Users List Page
 * Server component for authentication
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UsersListPageClient } from "./page-client";

export default async function UsersListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/users/list`);

  return <UsersListPageClient locale={locale} user={user} />;
}
