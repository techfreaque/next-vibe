/**
 * Subscriptions List Page
 * Server component for browsing all subscriptions
 */

export const dynamic = "force-dynamic";

import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SubscriptionListClientPage } from "./page-client";

interface SubscriptionListPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface SubscriptionListPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SubscriptionListPageProps): Promise<SubscriptionListPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/subscriptions/list`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: SubscriptionListPageData): React.JSX.Element {
  return <SubscriptionListClientPage locale={locale} user={user} />;
}

export default async function SubscriptionListPage({
  params,
}: SubscriptionListPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
