/**
 * Leads Stats Page
 * Server component for leads statistics and analytics
 */

import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons";
import type React from "react";

import { LeadsStatsClient } from "@/app/api/[locale]/leads/stats/_components/leads-stats-client";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    title: t("app.admin.leads.leads.admin.stats.title"),
    description: t("app.admin.leads.leads.admin.stats.description"),
  };
}

export default async function LeadsStatsPage({
  params,
}: LeadsStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/stats`);

  return (
    <Div className="flex flex-col gap-6">
      {/* Stats Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("app.admin.leads.leads.admin.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsStatsClient locale={locale} user={user} />
        </CardContent>
      </Card>
    </Div>
  );
}
