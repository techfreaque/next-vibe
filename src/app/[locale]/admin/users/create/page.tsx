/**
 * User Create Page
 * Server component for authentication
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "../i18n";
import { UserCreatePageClient } from "./page-client";

interface UserCreatePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface UserCreatePageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function generateMetadata({
  params,
}: UserCreatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);

  return {
    title: t("actions.addUser"),
    description: t("create.description"),
  };
}

export async function tanstackLoader({
  params,
}: UserCreatePageProps): Promise<UserCreatePageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/users/create`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: UserCreatePageData): React.JSX.Element {
  return <UserCreatePageClient locale={locale} user={user} />;
}

export default async function UserCreatePage({
  params,
}: UserCreatePageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
