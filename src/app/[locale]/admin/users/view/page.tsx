/**
 * User View Page
 * Displays comprehensive user information using EndpointsPage
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserViewPageClient } from "./page-client";

export default async function UserViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<{ userId?: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { userId } = await searchParams;

  const user = await requireAdminUser(locale, `/${locale}/admin/users/view`);

  return <UserViewPageClient locale={locale} user={user} userId={userId} />;
}
