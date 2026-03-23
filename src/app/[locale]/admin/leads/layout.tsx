/**
 * Admin Leads Layout
 * Shared layout for all admin leads pages with navigation and import status
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminLeadsLayoutClient } from "./_components/admin-leads-layout-client";

export interface AdminLeadsLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<AdminLeadsLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads`);
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: AdminLeadsLayoutData): React.JSX.Element {
  return (
    <AdminLeadsLayoutClient locale={locale}>{children}</AdminLeadsLayoutClient>
  );
}

export default async function AdminLeadsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
