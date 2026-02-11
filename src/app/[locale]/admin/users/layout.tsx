/**
 * Admin Users Layout
 * Shared layout for all admin users pages with navigation
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminUsersLayoutClient } from "./components/admin-users-layout-client";

interface AdminUsersLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminUsersLayout({
  children,
  params,
}: AdminUsersLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/users`);

  return (
    <AdminUsersLayoutClient locale={locale}>{children}</AdminUsersLayoutClient>
  );
}
