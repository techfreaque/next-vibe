/**
 * Endpoints Admin Layout
 */

import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

export interface EndpointsAdminLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<EndpointsAdminLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/endpoints`);
  return {};
}

export function TanstackPage({
  children,
}: EndpointsAdminLayoutData): JSX.Element {
  return <>{children}</>;
}

export default async function EndpointsAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
