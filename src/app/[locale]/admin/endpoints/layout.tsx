/**
 * Endpoints Admin Layout
 */

import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface EndpointsAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EndpointsAdminLayout({
  children,
  params,
}: EndpointsAdminLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/endpoints`);
  return <>{children}</>;
}
