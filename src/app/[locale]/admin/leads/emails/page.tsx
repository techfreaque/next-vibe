/**
 * Leads Email Previews Page
 * Preview and manage email templates
 */

import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { H3, P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type React from "react";

import { emailService } from "@/app/api/[locale]/v1/core/leads/campaigns/emails";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsEmailsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

const getStageDisplayName = (stage: string): string => {
  return stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default async function LeadsEmailsPage({
  params,
}: LeadsEmailsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Get all available journeys and their stages server-side
  const availableJourneys = emailService.getAvailableJourneys();
  const journeyData = availableJourneys.map((journey) => {
    const info = emailService.getJourneyInfo(journey, t);
    const stages = emailService.getAvailableStages(journey);
    return {
      variant: journey,
      info,
      stages,
    };
  });

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.admin.emails.description")}
        </P>
      </Div>

      {/* Email Templates Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.leads.leads.admin.emails.title")}</CardTitle>
          <P className="text-gray-600 dark:text-gray-400">
            {t("app.admin.leads.leads.admin.emails.subtitle")}
          </P>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={availableJourneys[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
                </Div>

                {/* Email Templates Grid */}
                <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {journey.stages.map((stage) => (
                    <Card
                      key={`${journey.variant}-${stage}`}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {getStageDisplayName(stage)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <Div className="text-sm text-gray-600 dark:text-gray-400">
                          <P>
                            <strong>
                              {t("app.admin.leads.leads.admin.emails.journey")}:
                            </strong>{" "}
                            {journey.info.name}
                          </P>
                          <P>
                            <strong>
                              {t("app.admin.leads.leads.admin.emails.stage")}:
                            </strong>{" "}
                            {getStageDisplayName(stage)}
                          </P>
                        </Div>

                        <Button asChild className="w-full">
                          <Link
                            href={`/${locale}/admin/leads/emails/${journey.variant}/${stage}`}
                          >
                            {t(
                              "app.admin.leads.leads.admin.emails.view_preview",
                            )}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Div>

                {/* Journey Stats */}
                <Div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <Div className="flex items-center justify-between text-sm">
                    <Span className="text-gray-600 dark:text-gray-400">
                      {t("app.admin.leads.leads.admin.emails.total_templates")}:
                    </Span>
                    <Span className="font-medium">
                      {journey.stages.length}{" "}
                      {t("app.admin.leads.leads.admin.emails.templates")}
                    </Span>
                  </Div>
                </Div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </Div>
  );
}
