import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerAccountEditPageClient } from "./page-client";

interface MessengerAccountEditPageProps {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}

export interface MessengerAccountEditPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: MessengerAccountEditPageProps): Promise<MessengerAccountEditPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/accounts`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: MessengerAccountEditPageData): JSX.Element {
  return <MessengerAccountEditPageClient locale={locale} user={user} id={id} />;
}

export default async function MessengerAccountEditPage({
  params,
}: MessengerAccountEditPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
