/**
 * Admin Layout
 * Layout for admin pages with navigation
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminLayoutClient } from "./_components/admin-layout-client";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  const user = await requireAdminUser(locale, `/${locale}/admin`);

  return (
    <AdminLayoutClient locale={locale} user={user}>
      {children}
    </AdminLayoutClient>
  );
}
