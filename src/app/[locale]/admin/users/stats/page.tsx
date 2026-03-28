/**
 * Users Stats Page
 * Server component for users statistics and analytics using EndpointRenderer
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type React from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "../i18n";
import { UsersStatsClientPage } from "./page-client";

interface UsersStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface UsersStatsPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function generateMetadata({
  params,
}: UsersStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);

  return {
    title: t("stats.title"),
    description: t("stats.description"),
  };
}

export async function tanstackLoader({
  params,
}: UsersStatsPageProps): Promise<UsersStatsPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/users/stats`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: UsersStatsPageData): React.JSX.Element {
  return <UsersStatsClientPage locale={locale} user={user} />;
}

export default async function UsersStatsPage({
  params,
}: UsersStatsPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
