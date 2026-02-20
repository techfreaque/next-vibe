/**
 * Admin Users Layout
 * Shared layout for all admin users pages with navigation
 */

import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface AdminUsersLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminUsersLayout({
  children,
  params,
}: AdminUsersLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/cron`);

  return <>{children}</>;
}
