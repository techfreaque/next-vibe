/**
 * Leads Email Previews Page
 * Preview and manage email templates
 */

import Link from "next/link";
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

  const getStageDisplayName = (stage: string): string => {
    return stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.admin.emails.description")}
        </p>
      </div>

      {/* Email Templates Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.leads.leads.admin.emails.title")}</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            {t("app.admin.leads.leads.admin.emails.subtitle")}
          </p>
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
                className="space-y-4"
              >
                {/* Journey Description */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    {journey.info.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                    {journey.info.description}
                  </p>
                </div>

                {/* Email Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>
                            <strong>
                              {t("app.admin.leads.leads.admin.emails.journey")}:
                            </strong>{" "}
                            {journey.info.name}
                          </p>
                          <p>
                            <strong>
                              {t("app.admin.leads.leads.admin.emails.stage")}:
                            </strong>{" "}
                            {getStageDisplayName(stage)}
                          </p>
                        </div>

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
                </div>

                {/* Journey Stats */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("app.admin.leads.leads.admin.emails.total_templates")}:
                    </span>
                    <span className="font-medium">
                      {journey.stages.length}{" "}
                      {t("app.admin.leads.leads.admin.emails.templates")}
                    </span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
