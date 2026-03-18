import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerComposePageClient } from "./page-client";

interface MessengerComposePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MessengerComposePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MessengerComposePageProps): Promise<MessengerComposePageData> {
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
}: MessengerComposePageData): JSX.Element {
  return <MessengerComposePageClient locale={locale} user={user} />;
}

export default async function MessengerComposePage({
  params,
}: MessengerComposePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
