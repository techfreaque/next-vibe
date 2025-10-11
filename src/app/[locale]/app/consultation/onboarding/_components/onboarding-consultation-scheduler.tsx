"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";

import type { AvailabilityResponseType } from "@/app/api/[locale]/v1/core/consultation/availability/schema";
import type { ConsultationItemType } from "@/app/api/[locale]/v1/core/consultation/db";
import { useConsultationScheduler } from "@/app/api/[locale]/v1/core/consultation/hooks";
import { ConsultationValidationUtils } from "@/app/api/[locale]/v1/core/consultation/validation-repository";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { DateSelectionSection } from "./date-selection-section";
import { MessageInputSection } from "./message-input-section";
import { SubmitSection } from "./submit-section";
import { TimeSelectionSection } from "./time-selection-section";

interface OnboardingConsultationSchedulerProps {
  user: CompleteUserType;
  locale: CountryLanguage;
  availabilityData: AvailabilityResponseType | null;
  existingConsultation?: ConsultationItemType | null;
  isUpdate?: boolean;
}

export function OnboardingConsultationScheduler({
  user,
  locale,
  availabilityData,
  existingConsultation,
  isUpdate = false,
}: OnboardingConsultationSchedulerProps): JSX.Element {
  const router = useRouter();
  const { t } = simpleT(locale);

  // Use the custom hook for all scheduling logic
  const {
    selectedDate,
    selectedTime,
    selectedTimezone,
    message,
    isSubmitting,
    isSuccess,
    error,
    timeSlots,
    canSubmit,
    hasChanges,
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    setMessage,
    handleSubmit,
    clearError,
  } = useConsultationScheduler({
    locale,
    userEmail: user.email,
    availability: availabilityData,
    isUpdate,
    existingConsultation: existingConsultation
      ? {
          preferredDate:
            existingConsultation.preferredDate instanceof Date
              ? existingConsultation.preferredDate.toISOString()
              : existingConsultation.preferredDate?.toString() || "",
          preferredTime: existingConsultation.preferredTime || "",
          message: existingConsultation.message || "",
        }
      : undefined,
  });

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                onClick={clearError}
              >
                <span className="sr-only">
                  {t("common.accessibility.srOnly.close")}
                </span>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduler Grid */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Date Selection - Takes more space on tablet+ */}
        <div className="md:flex-[2]">
          <DateSelectionSection
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            availabilitySlots={availabilityData?.slots || []}
            disabled={(date: Date) =>
              !ConsultationValidationUtils.isDateValidForBooking(date)
            }
            selectedTimezone={selectedTimezone}
            onTimezoneChange={setSelectedTimezone}
          />
        </div>

        {/* Time Selection - Takes less space on tablet+ */}
        <div className="md:flex-[1]">
          <TimeSelectionSection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            timeSlots={timeSlots}
            availability={availabilityData}
          />
        </div>
      </div>

      {/* Message Input Section */}
      <MessageInputSection
        message={message}
        onMessageChange={setMessage}
        disabled={isSubmitting}
      />

      {/* Submit Section */}
      <SubmitSection
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        isUpdate={isUpdate}
        hasChanges={hasChanges}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
