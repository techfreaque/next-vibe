/**
 * Emails Stats Page
 * Server component for email statistics and analytics
 */

import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailsStatsClient } from "./_components/emails-stats-client";

interface EmailsStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: EmailsStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.emails.stats.admin.stats.title"),
    description: t("app.admin.emails.components.admin.description"),
  };
}

export default async function EmailsStatsPage({
  params,
}: EmailsStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Stats Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("app.admin.emails.stats.admin.stats.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmailsStatsClient locale={locale} />
        </CardContent>
      </Card>
    </Div>
  );
}
