export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerAccountsPageClient } from "./page-client";

interface MessengerAccountsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MessengerAccountsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MessengerAccountsPageProps): Promise<MessengerAccountsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/accounts`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: MessengerAccountsPageData): JSX.Element {
  return <MessengerAccountsPageClient locale={locale} user={user} />;
}

export default async function MessengerAccountsPage({
  params,
}: MessengerAccountsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
