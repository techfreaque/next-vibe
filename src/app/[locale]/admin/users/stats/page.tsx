/**
 * Users Stats Page
 * Server component for users statistics and analytics using EndpointRenderer
 */

import type { Metadata } from "next";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { UsersStatsClientPage } from "./page-client";

interface UsersStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: UsersStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.users.stats.title"),
    description: t("app.admin.users.stats.description"),
  };
}

export default async function UsersStatsPage({
  params,
}: UsersStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <UsersStatsClientPage locale={locale} />;
}
