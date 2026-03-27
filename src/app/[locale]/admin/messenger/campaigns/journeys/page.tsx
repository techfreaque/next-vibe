/**
 * Leads Email Previews Page
 * Preview and manage email templates
 */

export const dynamic = "force-dynamic";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { H3, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { emailService } from "@/app/api/[locale]/leads/campaigns/emails";
import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsEmailsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

type JourneyVariant = ReturnType<
  typeof emailService.getAvailableJourneys
>[number];

interface JourneyDataItem {
  variant: JourneyVariant;
  info: ReturnType<typeof emailService.getJourneyInfo>;
  stages: ReturnType<typeof emailService.getAvailableStages>;
}

export interface LeadsEmailsPageData {
  locale: CountryLanguage;
  availableJourneys: JourneyVariant[];
  journeyData: JourneyDataItem[];
}

export async function tanstackLoader({
  params,
}: LeadsEmailsPageProps): Promise<LeadsEmailsPageData> {
  const { locale } = await params;
  await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns/journeys`,
  );

  // Get all available journeys and their stages server-side
  const availableJourneys = emailService.getAvailableJourneys();
  const journeyData = availableJourneys.map((journey) => {
    const info = emailService.getJourneyInfo(journey, locale);
    const stages = emailService.getAvailableStages(journey);
    return {
      variant: journey,
      info,
      stages,
    };
  });

  return { locale, availableJourneys, journeyData };
}

export function TanstackPage({
  locale,
  availableJourneys,
  journeyData,
}: LeadsEmailsPageData): React.JSX.Element {
  const { t } = simpleT(locale);
  const { t: scopedT } = leadsScopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <P className="text-muted-foreground">
        {t("app.admin.leads.leads.admin.emails.description")}
      </P>

      {/* Email Templates Overview */}
      <Tabs defaultValue={availableJourneys[0]} className="w-full">
        <TabsList
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: `repeat(${Math.min(journeyData.length, 6)}, minmax(0, 1fr))`,
          }}
        >
          {journeyData.map((journey) => (
            <TabsTrigger key={journey.variant} value={journey.variant}>
              {journey.info.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {journeyData.map((journey) => (
          <TabsContent
            key={journey.variant}
            value={journey.variant}
            className="flex flex-col gap-4"
          >
            {/* Journey Description */}
            <Div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <H3 className="font-semibold text-blue-900 dark:text-blue-100">
                {journey.info.name}
              </H3>
              <P className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                {journey.info.description}
              </P>
              <Span className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {journey.stages.length}{" "}
                {t("app.admin.leads.leads.admin.emails.templates")}
              </Span>
            </Div>

            {/* Email Templates Grid */}
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {journey.stages.map((stage) => (
                <Link
                  key={`${journey.variant}-${stage}`}
                  href={`/${locale}/admin/messenger/campaigns/journeys/${journey.variant}/${stage}`}
                >
                  <Card className="hover:shadow-lg transition-shadow hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        {scopedT(stage)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm"
                      >
                        {t("app.admin.leads.leads.admin.emails.view_preview")}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Div>
          </TabsContent>
        ))}
      </Tabs>
    </Div>
  );
}

export default async function LeadsEmailsPage({
  params,
}: LeadsEmailsPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
