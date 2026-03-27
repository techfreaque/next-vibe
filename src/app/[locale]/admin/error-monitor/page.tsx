export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { ErrorMonitorPageClient } from "./page-client";

interface ErrorMonitorAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface ErrorMonitorAdminPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: ErrorMonitorAdminPageProps): Promise<ErrorMonitorAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/error-monitor`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: ErrorMonitorAdminPageData): JSX.Element {
  return <ErrorMonitorPageClient locale={locale} user={user} />;
}

export default async function ErrorMonitorAdminPage({
  params,
}: ErrorMonitorAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
