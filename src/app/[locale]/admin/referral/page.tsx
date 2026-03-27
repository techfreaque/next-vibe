export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminReferralPageClient } from "./page-client";

interface AdminReferralPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface AdminReferralPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: AdminReferralPageProps): Promise<AdminReferralPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/referral`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: AdminReferralPageData): JSX.Element {
  return <AdminReferralPageClient locale={locale} user={user} />;
}

export default async function AdminReferralPage({
  params,
}: AdminReferralPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
