/**
 * Admin Users Layout
 * Shared layout for all admin users pages with navigation
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminUsersLayoutClient } from "./_components/admin-users-layout-client";

export interface AdminUsersLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<AdminUsersLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/users`);
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: AdminUsersLayoutData): React.JSX.Element {
  return (
    <AdminUsersLayoutClient locale={locale}>{children}</AdminUsersLayoutClient>
  );
}

export default async function AdminUsersLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
