/**
 * Referrals Page
 * Server component for referral codes, earnings and payout requests
 */

export const dynamic = "force-dynamic";

import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { ReferralsClientPage } from "./page-client";

interface ReferralsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ReferralsPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: ReferralsPageProps): Promise<ReferralsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/subscriptions/referrals`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: ReferralsPageData): React.JSX.Element {
  return <ReferralsClientPage locale={locale} user={user} />;
}

export default async function ReferralsPage({
  params,
}: ReferralsPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
