/**
 * Users Admin Stats Page (Home)
 * Main users management interface showing statistics and analytics
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface AdminUsersPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface AdminUsersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: AdminUsersPageProps): Promise<AdminUsersPageData> {
  const { locale } = await params;
  redirect(`/${locale}/admin/users/stats`);
  return { locale };
}

export function TanstackPage(): JSX.Element {
  return null as never;
}

export default async function AdminUsersPage({
  params,
}: AdminUsersPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/admin/users/stats`);
}
