/**
 * Admin Leads Layout
 * Shared layout for all admin leads pages with navigation and import status
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminLeadsLayoutClient } from "@/app/api/[locale]/v1/core/leads/_components/admin-leads-layout-client";

interface AdminLeadsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminLeadsLayout({
  children,
  params,
}: AdminLeadsLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/leads`);

  return (
    <AdminLeadsLayoutClient locale={locale}>{children}</AdminLeadsLayoutClient>
  );
}
