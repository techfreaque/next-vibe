/**
 * Users Admin Stats Page (Home)
 * Main users management interface showing statistics and analytics
 */

import { redirect } from "next/navigation";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface AdminUsersPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminUsersPage({
  params,
}: AdminUsersPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/admin/users/stats`);
}
