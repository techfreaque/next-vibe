export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerInboxPageClient } from "./page-client";

interface MessengerInboxPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MessengerInboxPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MessengerInboxPageProps): Promise<MessengerInboxPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/inbox`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: MessengerInboxPageData): JSX.Element {
  return <MessengerInboxPageClient locale={locale} user={user} />;
}

export default async function MessengerInboxPage({
  params,
}: MessengerInboxPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
