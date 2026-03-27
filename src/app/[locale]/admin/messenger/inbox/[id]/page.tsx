export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerMessageDetailPageClient } from "./page-client";

interface MessengerMessageDetailPageProps {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}

export interface MessengerMessageDetailPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: MessengerMessageDetailPageProps): Promise<MessengerMessageDetailPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/inbox`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: MessengerMessageDetailPageData): JSX.Element {
  return (
    <MessengerMessageDetailPageClient locale={locale} user={user} id={id} />
  );
}

export default async function MessengerMessageDetailPage({
  params,
}: MessengerMessageDetailPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
