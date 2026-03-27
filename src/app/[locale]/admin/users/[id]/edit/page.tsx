/**
 * User Edit Page
 * Server component for authentication
 */

export const dynamic = "force-dynamic";

import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserEditPageClient } from "./page-client";

interface UserEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export interface UserEditPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: UserEditPageProps): Promise<UserEditPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/users/${id}/edit`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: UserEditPageData): React.JSX.Element {
  return <UserEditPageClient locale={locale} user={user} userId={id} />;
}

export default async function UserEditPage({
  params,
}: UserEditPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
