/**
 * Consultations Admin Stats Page (Home)
 * Main consultations management interface showing statistics and analytics
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: ConsultationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("consultations.admin.stats.title"),
    description: t("consultations.admin.description"),
  };
}

export default async function ConsultationsPage({
  params,
}: ConsultationsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/admin/consultations/stats`);
}
