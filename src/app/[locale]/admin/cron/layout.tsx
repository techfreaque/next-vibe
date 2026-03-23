/**
 * Admin Cron Layout
 * Shared layout for all admin cron pages with navigation
 */

import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

export interface AdminCronLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<AdminCronLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/cron`);
  return {};
}

export function TanstackPage({ children }: AdminCronLayoutData): JSX.Element {
  return <>{children}</>;
}

export default async function AdminCronLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
