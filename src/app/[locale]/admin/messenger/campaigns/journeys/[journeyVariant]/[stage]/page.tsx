/**
 * Email Preview Dynamic Route
 * Server-rendered email preview page
 */

import { notFound } from "next-vibe-ui/lib/not-found";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { EmailPreviewClient } from "@/app/[locale]/admin/messenger/campaigns/journeys/_components/email-preview-client";
import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { emailService } from "@/app/api/[locale]/leads/campaigns/emails";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/leads/enum";
import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import { isValidEnumValue } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailPreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    journeyVariant: typeof EmailJourneyVariantValues;
    stage: typeof EmailCampaignStageValues;
  }>;
}

export default async function EmailPreviewPage({
  params,
}: EmailPreviewPageProps): Promise<React.JSX.Element> {
  const { locale, journeyVariant, stage } = await params;
  const { t } = simpleT(locale);
  const { t: scopedT } = leadsScopedTranslation.scopedT(locale);

  // Require admin user authentication
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns/journeys/${journeyVariant}/${stage}`,
  );

  // Validate journey variant
  if (!isValidEnumValue(EmailJourneyVariant, journeyVariant)) {
    notFound();
  }

  // Validate stage
  if (!isValidEnumValue(EmailCampaignStage, stage)) {
    notFound();
  }

  // Check if template exists for this combination
  if (!emailService.hasTemplate(journeyVariant, stage)) {
    notFound();
  }

  // Generate email preview server-side
  const emailPreview = await emailService.generatePreview(
    journeyVariant,
    stage,
    {
      locale,
      companyName: t("config.appName"),
      companyEmail: contactClientRepository.getSupportEmail(locale),
    },
  );

  if (!emailPreview) {
    notFound();
  }

  // Get journey info for display
  const journeyInfo = emailService.getJourneyInfo(journeyVariant, locale);

  // Get navigation data
  const allJourneys = emailService.getAvailableJourneys();
  const currentJourneyStages = emailService.getAvailableStages(journeyVariant);
  const currentStageIndex = currentJourneyStages.indexOf(stage);
  const previousStage =
    currentStageIndex > 0 ? currentJourneyStages[currentStageIndex - 1] : null;
  const nextStage =
    currentStageIndex < currentJourneyStages.length - 1
      ? currentJourneyStages[currentStageIndex + 1]
      : null;

  return (
    <Div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Back Button */}
      <Div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Div className="flex items-center justify-between">
            <Div className="flex items-center flex flex-row gap-4">
              <Link href={`/${locale}/admin/messenger/campaigns/journeys`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center flex flex-row gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <Span>{t("app.admin.common.actions.back")}</Span>
                </Button>
              </Link>
              <Div>
                <H1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("app.admin.leads.leads.admin.emails.preview_title")}
                </H1>
                <P className="text-gray-600 dark:text-gray-400">
                  {journeyInfo.name} - {scopedT(stage)}
                </P>
              </Div>
            </Div>
            <Div className="text-sm text-gray-500 dark:text-gray-400">
              <Span className="font-medium">
                {t("app.admin.leads.leads.admin.emails.subject")}:
              </Span>{" "}
              {emailPreview.subject}
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Stage Navigation */}
      <Div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Div className="flex items-center justify-between">
            <Div className="flex items-center flex flex-row gap-2">
              {previousStage ? (
                <Link
                  href={`/${locale}/admin/messenger/campaigns/journeys/${journeyVariant}/${previousStage}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center flex flex-row gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <Span>{scopedT(previousStage)}</Span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center flex flex-row gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <Span>{t("app.admin.common.actions.previous")}</Span>
                </Button>
              )}
            </Div>

            <Div className="text-center">
              <Span className="text-sm text-gray-600 dark:text-gray-400">
                {currentStageIndex + 1}{" "}
                {t("app.admin.leads.leads.admin.emails.stage_of")}{" "}
                {currentJourneyStages.length}{" "}
                {t("app.admin.leads.leads.admin.emails.stages")}
              </Span>
            </Div>

            <Div className="flex items-center flex flex-row gap-2">
              {nextStage ? (
                <Link
                  href={`/${locale}/admin/messenger/campaigns/journeys/${journeyVariant}/${nextStage}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center flex flex-row gap-1"
                  >
                    <Span>{scopedT(nextStage)}</Span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center flex flex-row gap-1"
                >
                  <Span>{t("app.admin.common.actions.next")}</Span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Journey Selector */}
      <Div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Div className="flex items-center justify-center flex flex-row gap-4">
            <Span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("app.admin.leads.leads.admin.emails.journey")}:
            </Span>
            <Div className="flex flex flex-row gap-2">
              {allJourneys.map((journey) => {
                const isCurrentJourney = journey === journeyVariant;
                const journeyStages = emailService.getAvailableStages(journey);
                const firstStage = journeyStages[0];
                const currentJourneyInfo = emailService.getJourneyInfo(
                  journey,
                  locale,
                );

                return (
                  <Link
                    key={journey}
                    href={`/${locale}/admin/messenger/campaigns/journeys/${journey}/${firstStage}`}
                  >
                    <Button
                      variant={isCurrentJourney ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {currentJourneyInfo.name}
                    </Button>
                  </Link>
                );
              })}
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Email Content with Test Email Functionality */}
      <EmailPreviewClient
        journeyVariant={journeyVariant}
        stage={stage}
        emailPreview={emailPreview}
        companyName={t("config.appName")}
        companyEmail={contactClientRepository.getSupportEmail(locale)}
        locale={locale}
        user={user}
      />
    </Div>
  );
}
