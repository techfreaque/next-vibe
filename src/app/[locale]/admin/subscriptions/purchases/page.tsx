/**
 * Purchases Page
 * Server component for credit pack purchase history
 */

export const dynamic = "force-dynamic";

import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { PurchasesClientPage } from "./page-client";

interface PurchasesPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface PurchasesPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: PurchasesPageProps): Promise<PurchasesPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/subscriptions/purchases`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: PurchasesPageData): React.JSX.Element {
  return <PurchasesClientPage locale={locale} user={user} />;
}

export default async function PurchasesPage({
  params,
}: PurchasesPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
