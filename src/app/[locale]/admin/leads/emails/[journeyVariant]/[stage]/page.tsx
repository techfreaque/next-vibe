/**
 * Email Preview Dynamic Route
 * Server-rendered email preview page
 */

import { ArrowLeft, ChevronLeft, ChevronRight } from 'next-vibe-ui/ui/icons';
import Link from "next/link";
import { notFound } from "next/navigation";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";

import { EmailPreviewClient } from "@/app/[locale]/admin/leads/emails/_components/email-preview-client";
import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { emailService } from "@/app/api/[locale]/v1/core/leads/campaigns/emails";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/v1/core/leads/enum";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/v1/core/leads/enum";
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

  // Validate journey variant
  if (!Object.values(EmailJourneyVariant).includes(journeyVariant)) {
    notFound();
  }

  // Validate stage
  if (!Object.values(EmailCampaignStage).includes(stage)) {
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
      t,
      locale,
      companyName: t("config.appName"),
      companyEmail: contactClientRepository.getSupportEmail(locale),
    },
  );

  if (!emailPreview) {
    notFound();
  }

  // Get journey info for display
  const journeyInfo = emailService.getJourneyInfo(journeyVariant, t);

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
            <Div className="flex items-center space-x-4">
              <Link href={`/${locale}/admin/leads/emails`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
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
                  {journeyInfo.name} -{" "}
                  {stage
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
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
            <Div className="flex items-center space-x-2">
              {previousStage ? (
                <Link
                  href={`/${locale}/admin/leads/emails/${journeyVariant}/${previousStage}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <Span>
                      {previousStage
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <Span>{t("app.admin.common.actions.previous")}</Span>
                </Button>
              )}
            </Div>

            <Div className="text-center">
              <Span className="text-sm text-gray-600 dark:text-gray-400">
                {currentStageIndex + 1} of {currentJourneyStages.length} stages
              </Span>
            </Div>

            <Div className="flex items-center space-x-2">
              {nextStage ? (
                <Link
                  href={`/${locale}/admin/leads/emails/${journeyVariant}/${nextStage}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Span>
                      {nextStage
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center space-x-1"
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
          <Div className="flex items-center justify-center space-x-4">
            <Span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("app.admin.leads.leads.admin.emails.journey")}:
            </Span>
            <Div className="flex space-x-2">
              {allJourneys.map((journey) => {
                const isCurrentJourney = journey === journeyVariant;
                const journeyStages = emailService.getAvailableStages(journey);
                const firstStage = journeyStages[0];
                const journeyInfo = emailService.getJourneyInfo(journey, t);

                return (
                  <Link
                    key={journey}
                    href={`/${locale}/admin/leads/emails/${journey}/${firstStage}`}
                  >
                    <Button
                      variant={isCurrentJourney ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {journeyInfo.name}
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
      />
    </Div>
  );
}
