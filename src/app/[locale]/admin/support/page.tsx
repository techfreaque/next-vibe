export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminSupportPageClient } from "./page-client";

interface AdminSupportPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface AdminSupportPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: AdminSupportPageProps): Promise<AdminSupportPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/support`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: AdminSupportPageData): JSX.Element {
  return <AdminSupportPageClient locale={locale} user={user} />;
}

export default async function AdminSupportPage({
  params,
}: AdminSupportPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
