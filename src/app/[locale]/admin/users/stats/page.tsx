/**
 * Users Stats Page
 * Server component for users statistics and analytics
 */

import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UsersStatsClient } from "./_components/users-stats-client";

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
    title: t("app.admin.users.users.admin.stats.title"),
    description: t("app.admin.users.users.admin.stats.description"),
  };
}

export default async function UsersStatsPage({
  params,
}: UsersStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Stats Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("app.admin.users.users.admin.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersStatsClient locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
