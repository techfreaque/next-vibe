import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { debugLogger } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { businessDataRepository } from "@/app/api/[locale]/v1/core/business-data/repository";
import type { ConsultationItemType } from "@/app/api/[locale]/v1/core/consultation/db";
import { consultationRepository } from "@/app/api/[locale]/v1/core/consultation/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationSuccess } from "../../onboarding/_components/consultation-success";
import { BusinessDataCompletionPrompt } from "./_components/business-data-completion-prompt";
import { ConsultationInfoCard } from "./_components/consultation-info-card";
import { OnboardingConsultationScheduler } from "./_components/onboarding-consultation-scheduler";

interface OnboardingConsultationPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
  searchParams: Promise<{
    success?: string;
    date?: string;
    time?: string;
  }>;
}

export default async function OnboardingConsultationPage({
  params,
  searchParams,
}: OnboardingConsultationPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const searchParamsResult = await searchParams;
  const { t } = simpleT(locale);

  const logger = createEndpointLogger(false, Date.now(), locale);

  // Get user data
  const userResult = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );
  if (!userResult.success || !userResult.data) {
    redirect(
      `/${locale}/user/login?callbackUrl=/${locale}/app/consultation/onboarding`,
    );
  }

  const user = userResult.data;

  // Fetch business data completion status
  const businessDataResponse = await businessDataRepository.getAllBusinessData(
    user.id,
    user,
    locale,
    logger,
  );
  const businessDataCompletionStatus = businessDataResponse?.success
    ? businessDataResponse.data
    : null;

  // Check if user already has an active consultation (any status except cancelled/completed)
  const existingConsultationsResult =
    await consultationRepository.getConsultations(user.id);

  const existingConsultation: ConsultationItemType | null =
    existingConsultationsResult?.success
      ? existingConsultationsResult.data.consultations.find(
          (c) =>
            c.status !== "cancelled" &&
            c.status !== "completed" &&
            c.status !== "no_show",
        ) || null
      : null;
  const hasExistingConsultation = !!existingConsultation;

  // Fetch availability data using the convenience method
  const timezone = getDefaultTimezone(locale);
  const availabilityResult =
    await consultationRepository.getMonthlyAvailability(locale, timezone);

  const availabilityData = availabilityResult.success
    ? availabilityResult.data
    : null;

  // Log availability data for debugging
  debugLogger("[CONSULTATION_ONBOARDING] Page data loaded", {
    locale,
    timezone,
    hasExistingConsultation,
    availabilitySuccess: availabilityResult.success,
    availabilityError: availabilityResult.success
      ? null
      : availabilityResult.message,
    totalSlots: availabilityData?.slots?.length ?? 0,
    availableSlots:
      availabilityData?.slots?.filter((slot) => slot.available)?.length ?? 0,
    sampleSlots:
      availabilityData?.slots?.slice(0, 3)?.map((slot) => ({
        start: slot.start,
        available: slot.available,
      })) ?? [],
  });

  // If consultation was successfully scheduled, show success page
  if (searchParamsResult.success === "true") {
    return (
      <div className="min-h-screen bg-blue-50 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-blue-950/20 dark:from-blue-950/20 dark:to-purple-950/20 py-12">
        <div className="container mx-auto px-4">
          <ConsultationSuccess
            locale={locale}
            scheduledDate={searchParamsResult.date}
            scheduledTime={searchParamsResult.time}
            businessDataCompletionStatus={businessDataCompletionStatus}
          />
        </div>
      </div>
    );
  }

  // Default consultation scheduling page
  return (
    <div className="min-h-screen bg-blue-50 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-blue-950/20 dark:from-blue-950/20 dark:to-purple-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("onboarding.consultation.schedule.title")}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                {t("onboarding.consultation.schedule.description")}
              </p>
            </div>
          </div>

          {/* Business Data Completion Prompt */}
          <div className="max-w-4xl mx-auto">
            <BusinessDataCompletionPrompt
              locale={locale}
              businessDataCompletionStatus={businessDataCompletionStatus}
            />
          </div>

          {/* Consultation Info Card */}
          <div className="max-w-4xl mx-auto">
            <ConsultationInfoCard isUpdate={hasExistingConsultation} />
          </div>

          {/* Consultation Scheduler */}
          <div className="max-w-4xl mx-auto">
            <OnboardingConsultationScheduler
              locale={locale}
              user={user}
              availabilityData={availabilityData}
              existingConsultation={existingConsultation}
              isUpdate={hasExistingConsultation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
