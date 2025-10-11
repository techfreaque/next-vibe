/**
 * Consultations List Page
 * Server-side page for consultation list management
 */

import type { Metadata } from "next";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationsNavigation } from "../_components/consultations-navigation";
import { ConsultationsListClient } from "./_components/consultations-list-client";

interface ConsultationsListPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: ConsultationsListPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("consultations.admin.list.title"),
    description: t("consultations.admin.description"),
  };
}

export default async function ConsultationsListPage({
  params,
}: ConsultationsListPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("consultations.admin.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("consultations.admin.description")}
          </p>
        </div>

        <ConsultationsNavigation locale={locale} currentPage="list" />
      </div>

      {/* List Content */}
      <ConsultationsListClient locale={locale} />
    </div>
  );
}
