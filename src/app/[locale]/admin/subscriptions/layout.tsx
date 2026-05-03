/**
 * Admin Subscriptions Layout
 * Shared layout for all admin subscriptions pages with navigation
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminSubscriptionsLayoutClient } from "./_components/admin-subscriptions-layout-client";

export interface AdminSubscriptionsLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<AdminSubscriptionsLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/subscriptions`);
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: AdminSubscriptionsLayoutData): React.JSX.Element {
  return (
    <AdminSubscriptionsLayoutClient locale={locale}>
      {children}
    </AdminSubscriptionsLayoutClient>
  );
}

export default async function AdminSubscriptionsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
