/**
 * Email Preview Dynamic Route
 * Server-rendered email preview page
 */

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      companyName: t("app.appName"),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/admin/leads/emails`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t("common.actions.back")}</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("leads.admin.emails.preview_title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {journeyInfo.name} -{" "}
                  {stage
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                {t("leads.admin.emails.subject")}:
              </span>{" "}
              {emailPreview.subject}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
                    <span>
                      {previousStage
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
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
                  <span>{t("common.actions.previous")}</span>
                </Button>
              )}
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentStageIndex + 1} of {currentJourneyStages.length} stages
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {nextStage ? (
                <Link
                  href={`/${locale}/admin/leads/emails/${journeyVariant}/${nextStage}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>
                      {nextStage
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
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
                  <span>{t("common.actions.next")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Journey Selector */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("leads.admin.emails.journey")}:
            </span>
            <div className="flex space-x-2">
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
            </div>
          </div>
        </div>
      </div>

      {/* Email Content with Test Email Functionality */}
      <EmailPreviewClient
        journeyVariant={journeyVariant}
        stage={stage}
        emailPreview={emailPreview}
        companyName={t("app.appName")}
        companyEmail={contactClientRepository.getSupportEmail(locale)}
        locale={locale}
      />
    </div>
  );
}
