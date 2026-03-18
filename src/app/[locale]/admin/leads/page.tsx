/**
 * Leads Admin Stats Page (Home)
 * Main leads management interface showing statistics and overview
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface AdminLeadsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface AdminLeadsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: AdminLeadsPageProps): Promise<never> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads`);
  redirect(`/${locale}/admin/leads/stats`);
}

// oxlint-disable-next-line no-unused-vars
export function TanstackPage(_props: AdminLeadsPageData): never {
  redirect("/");
}

export default async function AdminLeadsPage({
  params,
}: AdminLeadsPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
