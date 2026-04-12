/**
 * Email Preview Dynamic Route
 * Server-rendered email preview page
 */

export const dynamic = "force-dynamic";

import { render } from "@react-email/render";
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
  EmailCampaignStageValue,
  EmailJourneyVariantValue,
} from "@/app/api/[locale]/leads/enum";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/leads/enum";
import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import { isValidEnumValue } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

interface EmailPreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    journeyVariant: typeof EmailJourneyVariantValue;
    stage: typeof EmailCampaignStageValue;
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
  journeyVariant: typeof EmailJourneyVariantValue;
  stage: typeof EmailCampaignStageValue;
  emailTo: string;
  emailSubject: string;
  emailHtml: string;
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
  previewTitle: string;
}

export async function tanstackLoader({
  params,
}: EmailPreviewPageProps): Promise<EmailPreviewPageData> {
  const { locale, journeyVariant, stage } = await params;
  const { t: configT } = configScopedTranslation.scopedT(locale);
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
  const emailPreviewResult = await emailService.generatePreview(
    journeyVariant,
    stage,
    {
      locale,
      companyName: configT("appName"),
      companyEmail: contactClientRepository.getSupportEmail(locale),
    },
  );

  if (!emailPreviewResult) {
    notFound();
  }

  // Render JSX to HTML string server-side for serialization
  const emailHtml = await render(emailPreviewResult.jsx);

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
    emailTo: emailPreviewResult.to,
    emailSubject: emailPreviewResult.subject,
    emailHtml,
    journeyName: journeyInfo.name,
    allJourneyEntries,
    currentJourneyStages,
    currentStageIndex,
    previousStage,
    nextStage,
    stageLabelText: scopedT(stage),
    previousStageLabel: previousStage ? scopedT(previousStage) : null,
    nextStageLabel: nextStage ? scopedT(nextStage) : null,
    companyName: configT("appName"),
    companyEmail: contactClientRepository.getSupportEmail(locale),
    previewTitle: scopedT("admin.emails.preview_title"),
    backLabel: scopedT("admin.emails.back"),
    prevLabel: scopedT("admin.emails.previous"),
    nextLabel: scopedT("admin.emails.next"),
    stageOfLabel: scopedT("admin.emails.stage_of"),
    stagesLabel: scopedT("admin.emails.stages"),
    subjectLabel: scopedT("admin.emails.subject"),
    journeyLabel: scopedT("admin.emails.journey"),
  };
}

export function TanstackPage({
  locale,
  user,
  journeyVariant,
  stage,
  emailTo,
  emailSubject,
  emailHtml,
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
  previewTitle,
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
                  {previewTitle}
                </H1>
                <P className="text-gray-600 dark:text-gray-400">
                  {journeyName} - {stageLabelText}
                </P>
              </Div>
            </Div>
            <Div className="text-sm text-gray-500 dark:text-gray-400">
              <Span className="font-medium">{subjectLabel}:</Span>{" "}
              {emailSubject}
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
        emailTo={emailTo}
        emailSubject={emailSubject}
        emailHtml={emailHtml}
        companyName={companyName}
        companyEmail={companyEmail}
        locale={locale}
        user={user}
      />
    </Div>
  );
}

export default async function EmailPreviewPage({
  params,
}: EmailPreviewPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
