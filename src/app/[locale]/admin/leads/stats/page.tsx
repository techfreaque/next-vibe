/**
 * Leads Stats Page
 * Server component for leads statistics and analytics
 */

import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadsStatsClient } from "./_components/leads-stats-client";

interface LeadsStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: LeadsStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("leads.admin.stats.title"),
    description: t("leads.admin.stats.description"),
  };
}

export default async function LeadsStatsPage({
  params,
}: LeadsStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Stats Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("leads.admin.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsStatsClient locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
