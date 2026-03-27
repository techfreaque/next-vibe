export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerAccountCreatePageClient } from "./page-client";

interface MessengerAccountCreatePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MessengerAccountCreatePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MessengerAccountCreatePageProps): Promise<MessengerAccountCreatePageData> {
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
}: MessengerAccountCreatePageData): JSX.Element {
  return <MessengerAccountCreatePageClient locale={locale} user={user} />;
}

export default async function MessengerAccountCreatePage({
  params,
}: MessengerAccountCreatePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
