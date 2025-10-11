/**
 * Consultations Stats Page
 * Server component for consultation statistics and analytics
 */

import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationsNavigation } from "../_components/consultations-navigation";
import { ConsultationsStatsClient } from "./_components/consultations-stats-client";

interface ConsultationsStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: ConsultationsStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("consultations.admin.stats.title"),
    description: t("consultations.admin.description"),
  };
}

export default async function ConsultationsStatsPage({
  params,
}: ConsultationsStatsPageProps): Promise<React.JSX.Element> {
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

        <ConsultationsNavigation locale={locale} currentPage="stats" />
      </div>

      {/* Stats Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("consultations.admin.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationsStatsClient locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
