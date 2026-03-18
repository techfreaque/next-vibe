/**
 * A/B Testing Settings Page
 * Configure and monitor A/B testing for email campaigns
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { ABTestingClient } from "./ab-testing-client";

interface ABTestingPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ABTestingPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: ABTestingPageProps): Promise<ABTestingPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns/ab-testing`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: ABTestingPageData): React.JSX.Element {
  return <ABTestingClient locale={locale} user={user} />;
}

export default async function ABTestingPage({
  params,
}: ABTestingPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
