/**
 * Users List Page
 * Server component for authentication
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UsersListPageClient } from "./page-client";

interface UsersListPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface UsersListPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: UsersListPageProps): Promise<UsersListPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/users/list`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: UsersListPageData): JSX.Element {
  return <UsersListPageClient locale={locale} user={user} />;
}

export default async function UsersListPage({
  params,
}: UsersListPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
