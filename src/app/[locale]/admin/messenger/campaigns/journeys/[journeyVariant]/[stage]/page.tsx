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
import type { EmailTemplateResult } from "@/app/api/[locale]/leads/campaigns/emails";
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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailPreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    journeyVariant: typeof EmailJourneyVariantValues;
    stage: typeof EmailCampaignStageValues;
  }>;
}

interface JourneyEntry {
  variant: string;
  stages: string[];
  name: string;
  firstStage: string | undefined;
}

export interface EmailPreviewPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  journeyVariant: typeof EmailJourneyVariantValues;
  stage: typeof EmailCampaignStageValues;
  emailPreview: EmailTemplateResult;
  journeyName: string;
  allJourneyEntries: JourneyEntry[];
  currentJourneyStages: string[];
  currentStageIndex: number;
  previousStage: string | null;
  nextStage: string | null;
  stageLabelText: string;
  previousStageLabel: string | null;
  nextStageLabel: string | null;
  companyName: string;
  companyEmail: string;
  backLabel: string;
  prevLabel: string;
  nextLabel: string;
  stageOfLabel: string;
  stagesLabel: string;
  subjectLabel: string;
  journeyLabel: string;
}

export async function tanstackLoader({
  params,
}: EmailPreviewPageProps): Promise<EmailPreviewPageData> {
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

  const allJourneyEntries: JourneyEntry[] = allJourneys.map((journey) => {
    const stages = emailService.getAvailableStages(journey);
    return {
      variant: journey,
      stages,
      name: emailService.getJourneyInfo(journey, locale).name,
      firstStage: stages[0],
    };
  });

  return {
    locale,
    user,
    journeyVariant,
    stage,
    emailPreview,
    journeyName: journeyInfo.name,
    allJourneyEntries,
    currentJourneyStages,
    currentStageIndex,
    previousStage,
    nextStage,
    stageLabelText: scopedT(stage),
    previousStageLabel: previousStage ? scopedT(previousStage) : null,
    nextStageLabel: nextStage ? scopedT(nextStage) : null,
    companyName: t("config.appName"),
    companyEmail: contactClientRepository.getSupportEmail(locale),
    backLabel: t("app.admin.common.actions.back"),
    prevLabel: t("app.admin.common.actions.previous"),
    nextLabel: t("app.admin.common.actions.next"),
    stageOfLabel: t("app.admin.leads.leads.admin.emails.stage_of"),
    stagesLabel: t("app.admin.leads.leads.admin.emails.stages"),
    subjectLabel: t("app.admin.leads.leads.admin.emails.subject"),
    journeyLabel: t("app.admin.leads.leads.admin.emails.journey"),
  };
}

export function TanstackPage({
  locale,
  user,
  journeyVariant,
  stage,
  emailPreview,
  journeyName,
  allJourneyEntries,
  currentJourneyStages,
  currentStageIndex,
  previousStage,
  nextStage,
  stageLabelText,
  previousStageLabel,
  nextStageLabel,
  companyName,
  companyEmail,
  backLabel,
  prevLabel,
  nextLabel,
  stageOfLabel,
  stagesLabel,
  subjectLabel,
  journeyLabel,
}: EmailPreviewPageData): React.JSX.Element {
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
                  <Span>{backLabel}</Span>
                </Button>
              </Link>
              <Div>
                <H1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("app.admin.leads.leads.admin.emails.preview_title", {
                    t: stageLabelText,
                  })}
                </H1>
                <P className="text-gray-600 dark:text-gray-400">
                  {journeyName} - {stageLabelText}
                </P>
              </Div>
            </Div>
            <Div className="text-sm text-gray-500 dark:text-gray-400">
              <Span className="font-medium">{subjectLabel}:</Span>{" "}
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
                    <Span>{previousStageLabel}</Span>
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
                  <Span>{prevLabel}</Span>
                </Button>
              )}
            </Div>

            <Div className="text-center">
              <Span className="text-sm text-gray-600 dark:text-gray-400">
                {currentStageIndex + 1} {stageOfLabel}{" "}
                {currentJourneyStages.length} {stagesLabel}
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
                    <Span>{nextStageLabel}</Span>
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
                  <Span>{nextLabel}</Span>
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
              {journeyLabel}:
            </Span>
            <Div className="flex flex flex-row gap-2">
              {allJourneyEntries.map((entry) => {
                const isCurrentJourney = entry.variant === journeyVariant;

                return (
                  <Link
                    key={entry.variant}
                    href={`/${locale}/admin/messenger/campaigns/journeys/${entry.variant}/${entry.firstStage}`}
                  >
                    <Button
                      variant={isCurrentJourney ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {entry.name}
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
        companyName={companyName}
        companyEmail={companyEmail}
        locale={locale}
        user={user}
      />
    </Div>
  );
}

// Helper to avoid "t is not defined" — translations are baked via the loader
function t(key: string, _vars?: Record<string, unknown>): string {
  return key;
}

export default async function EmailPreviewPage({
  params,
}: EmailPreviewPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
