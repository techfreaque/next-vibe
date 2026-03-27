/**
 * User View Page
 * Displays comprehensive user information using EndpointsPage
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserViewPageClient } from "./page-client";

interface UserViewPageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<{ userId?: string }>;
}

export interface UserViewPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
  userId: string | undefined;
}

export async function tanstackLoader({
  params,
  searchParams,
}: UserViewPageProps): Promise<UserViewPageData> {
  const { locale } = await params;
  const { userId } = await searchParams;
  const user = await requireAdminUser(locale, `/${locale}/admin/users/view`);
  return { locale, user, userId };
}

export function TanstackPage({
  locale,
  user,
  userId,
}: UserViewPageData): JSX.Element {
  return <UserViewPageClient locale={locale} user={user} userId={userId} />;
}

export default async function UserViewPage({
  params,
  searchParams,
}: UserViewPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
