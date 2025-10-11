/**
 * Consultation API Hooks
 * Production-ready hooks for interacting with the Consultation API
 */

import { useRouter } from "next/navigation";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ConsultationAvailabilityResponseTypeOutput as AvailabilityResponseType } from "@/app/api/[locale]/v1/core/consultation/availability/definition";
import { clientConsultationRepository } from "@/app/api/[locale]/v1/core/consultation/client-consultation/repository";
import type {
  BusinessDataCompletionStatus,
  DateAvailability,
  TimeSlot,
} from "@/app/api/[locale]/v1/core/consultation/client-consultation/types";
import {
  ConsultationSortField,
  ConsultationStatus,
  SortOrder,
} from "@/app/api/[locale]/v1/core/consultation/enum";
import {
  consultationValidationRepository,
  weekdayRepository,
} from "@/app/api/[locale]/v1/core/consultation/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  formatDateForDisplay,
  formatSingleDateStringWithTimezone,
  getDefaultTimezone,
} from "@/i18n/core/localization-utils";

import createEndpoints from "./create/definition";
import listEndpoints from "./list/definition";

// Legacy type for compatibility
export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
}

/****************************
 * CONSTANTS
 ****************************/

const MESSAGE_TEMPLATES = {
  CHALLENGES_PREFIX: "Current Challenges: ",
  GOALS_PREFIX: "Goals: ",
  SEPARATOR: "\n\n",
} as const;

/****************************
 * MAIN ENDPOINT HOOKS
 ****************************/

// Default values for consultation form - simplified schema (business data comes from user table)
const DEFAULT_CONSULTATION_VALUES = {
  preferredDate: "",
  preferredTime: "",
  message: "",
} as const;

/**
 * Hook for consultation creation with form capabilities
 */
export function useConsultationEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof createEndpoints> {
  // Extract and stabilize the actual values used
  const enabled = params?.enabled !== false;

  // Memoize the queryOptions object to prevent infinite re-renders
  const queryOptions = useMemo(
    () => ({
      enabled,
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    [enabled],
  );

  // Memoize the formOptions object to prevent infinite re-renders
  const formOptions = useMemo(
    () => ({
      persistForm: false,
      defaultValues: DEFAULT_CONSULTATION_VALUES,
    }),
    [], // No dependencies since all values are constants
  );

  return useEndpoint(
    createEndpoints,
    {
      queryOptions,
      formOptions,
    },
    params.logger,
  );
}

/**
 * Hook for consultation list with query capabilities
 */
export function useConsultationListEndpoint(params: {
  enabled?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
  logger: EndpointLogger;
}): EndpointReturn<typeof listEndpoints> {
  // Extract and stabilize the actual values used
  const enabled = params?.enabled !== false;
  const status = params?.status;
  const limit = params?.limit || 10;
  const offset = params?.offset || 0;

  // Memoize the request data to prevent infinite re-renders
  const requestData = useMemo(
    () => ({
      status: status
        ? [
            status as (typeof ConsultationStatus)[keyof typeof ConsultationStatus],
          ]
        : [ConsultationStatus.PENDING, ConsultationStatus.SCHEDULED],
      limit: limit.toString(),
      offset: offset.toString(),
      sortBy: [ConsultationSortField.CREATED_AT],
      sortOrder: [SortOrder.DESC],
    }),
    [status, limit, offset],
  );

  // Memoize the entire queryOptions object to prevent infinite re-renders
  const queryOptions = useMemo(
    () => ({
      enabled,
      refetchOnWindowFocus: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      requestData,
    }),
    [enabled, requestData],
  );

  return useEndpoint(
    listEndpoints,
    {
      queryOptions,
    },
    params.logger,
  );
}

/****************************
 * LEGACY COMPATIBILITY HOOKS
 * These maintain backward compatibility with existing code
 ****************************/

/**
 * Hook for scheduling a consultation during onboarding
 * This is the main hook used in the consultation scheduler component
 */
export function useScheduleConsultation(logger: EndpointLogger): {
  mutateAsync: (data: {
    preferredDate: string;
    preferredTime: string;
    businessType: string;
    currentChallenges: string;
    goals: string;
    contactEmail: string;
    contactPhone?: string;
    timezone: string;
  }) => Promise<void>;
  isPending: boolean;
  error: ErrorResponseType | null;
  validateBookingTime: (
    date: string,
    time: string,
    timezone: string,
  ) => {
    isValid: boolean;
    error?: string;
  };
} {
  const consultationEndpoint = useConsultationEndpoint({
    logger,
  });

  // Business logic validation using shared utilities
  const validateBookingTime = useMemo(() => {
    return (
      date: string,
      time: string,
      timezone: string,
    ): { isValid: boolean; error?: string } => {
      const result = consultationValidationRepository.validateBookingTime(
        date,
        time,
        timezone,
      );

      if (result.success) {
        return { isValid: true };
      } else {
        return { isValid: false, error: result.message };
      }
    };
  }, []);

  return {
    mutateAsync: async (data: {
      preferredDate: string;
      preferredTime: string;
      businessType: string;
      currentChallenges: string;
      goals: string;
      contactEmail: string;
      contactPhone?: string;
      timezone: string;
    }): Promise<void> => {
      // Validate booking time before proceeding
      const validation = validateBookingTime(
        data.preferredDate,
        data.preferredTime,
        data.timezone,
      );
      if (!validation.isValid) {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error(
          validation.error ||
            "validationErrors.consultation.invalid_booking_time",
        );
      }

      // Transform the data to match the API schema
      const challengesText =
        MESSAGE_TEMPLATES.CHALLENGES_PREFIX + data.currentChallenges;
      const goalsText = MESSAGE_TEMPLATES.GOALS_PREFIX + data.goals;
      const messageText =
        challengesText + MESSAGE_TEMPLATES.SEPARATOR + goalsText;

      // Set form values (simplified schema - business data comes from user table)
      if (consultationEndpoint.create) {
        consultationEndpoint.create.setValue(
          "preferredDate",
          data.preferredDate,
        );
        consultationEndpoint.create.setValue(
          "preferredTime",
          data.preferredTime,
        );
        consultationEndpoint.create.setValue("message", messageText);

        // Submit the form - this will throw an error if there's an issue
        await consultationEndpoint.create.onSubmit(undefined);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error(
          "consultationErrors.create.form.error.unknown.description",
        );
      }
    },
    isPending: consultationEndpoint.create.isSubmitting,
    error: consultationEndpoint.create.error,
    validateBookingTime,
  };
}

/****************************
 * CONSULTATION SCHEDULER HOOK
 * Advanced hook for consultation scheduling with state management
 ****************************/

interface UseConsultationSchedulerProps {
  locale: CountryLanguage;
  userEmail: string;
  availability: AvailabilityResponseType | null;
  isUpdate?: boolean;
  existingConsultation?: {
    preferredDate: string;
    preferredTime: string;
    message: string;
  };
  logger: EndpointLogger;
}

interface UseConsultationSchedulerReturn {
  // State
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  selectedTimezone: string;
  message: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;

  // Computed values
  timeSlots: TimeSlot[];
  canSubmit: boolean;
  hasChanges: boolean;

  // Actions
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;
  setSelectedTimezone: (timezone: string) => void;
  setMessage: (message: string) => void;
  handleSubmit: () => Promise<void>;
  clearError: () => void;
}

/**
 * Advanced consultation scheduler hook with complete state management
 * Handles all consultation scheduling logic including validation, submission, and state
 */
export function useConsultationScheduler({
  locale,
  userEmail,
  availability,
  isUpdate = false,
  existingConsultation,
  logger,
}: UseConsultationSchedulerProps): UseConsultationSchedulerReturn {
  const { t } = useTranslation();
  const router = useRouter();

  // Ref to prevent multiple navigation calls
  const isNavigatingRef = useRef(false);

  // Get default message based on current translations
  const getDefaultMessage = useCallback((): string => {
    const businessType = t("onboarding.consultation.defaultBusinessType");
    const challenges = t("onboarding.consultation.defaultChallenges");
    const goals = t("onboarding.consultation.defaultGoals");

    return [businessType, challenges, goals].join("\n\n");
  }, [t]);

  // State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    isUpdate && existingConsultation?.preferredDate
      ? new Date(existingConsultation.preferredDate)
      : undefined,
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    isUpdate && existingConsultation?.preferredTime
      ? existingConsultation.preferredTime
      : undefined,
  );
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    getDefaultTimezone(locale),
  );
  const [message, setMessage] = useState<string>(
    existingConsultation?.message || getDefaultMessage(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const scheduleConsultation = useScheduleConsultation(logger);

  // Computed values
  const timeSlots = useMemo((): TimeSlot[] => {
    if (!selectedDate) {
      return [];
    }

    return clientConsultationRepository.getTimeSlotsForDate({
      availabilityData: availability,
      date: selectedDate,
      locale,
      timezone: selectedTimezone,
    });
  }, [availability, selectedDate, locale, selectedTimezone]);

  // Clear selected time if it's not available on the new selected date
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    // Check if the currently selected time is available on the selected date
    const isTimeAvailable = timeSlots.some(
      (slot) => slot.time === selectedTime && slot.available,
    );

    // If the selected time is not available on the new date, clear it
    if (!isTimeAvailable) {
      setSelectedTime(undefined);
    }
  }, [selectedDate, selectedTime, timeSlots]);

  const canSubmit = Boolean(selectedDate && selectedTime && !isSubmitting);

  const hasChanges = useMemo(() => {
    if (!isUpdate || !existingConsultation) {
      return true; // For new consultations, always show the button
    }

    const originalDate = existingConsultation.preferredDate
      ? new Date(existingConsultation.preferredDate)
      : undefined;
    const originalTime = existingConsultation.preferredTime || undefined;

    const dateChanged =
      selectedDate?.toISOString().split("T")[0] !==
      originalDate?.toISOString().split("T")[0];
    const timeChanged = selectedTime !== originalTime;

    return dateChanged || timeChanged;
  }, [isUpdate, existingConsultation, selectedDate, selectedTime]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Actions
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedDate || !selectedTime || !userEmail) {
      setError(t("validationErrors.consultation.invalid_date_time"));
      return;
    }

    // Prevent multiple submissions or navigation calls
    if (isSubmitting || isNavigatingRef.current) {
      return;
    }

    // Format date using timezone-aware formatting to match calendar selection
    const formattedDate = formatSingleDateStringWithTimezone(
      selectedDate,
      selectedTimezone,
    );

    try {
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      // Parse the message to extract business type, challenges, and goals
      // If message follows the default format, parse it; otherwise use the message as challenges
      const messageParts = message.split("\n\n");
      const businessType =
        messageParts[0] || t("onboarding.consultation.defaultBusinessType");
      const challenges =
        messageParts[1] ||
        message ||
        t("onboarding.consultation.defaultChallenges");
      const goals =
        messageParts[2] || t("onboarding.consultation.defaultGoals");

      // Call the API and wait for the response
      await scheduleConsultation.mutateAsync({
        preferredDate: formattedDate,
        preferredTime: selectedTime,
        businessType: businessType,
        currentChallenges: challenges,
        goals: goals,
        contactEmail: userEmail,
        contactPhone: "", // Optional field
        timezone: selectedTimezone,
      });

      setIsSuccess(true);

      // Show success state briefly before redirect
      setTimeout(() => {
        // Prevent multiple navigation calls
        if (isNavigatingRef.current) {
          return;
        }

        isNavigatingRef.current = true;

        // If we reach this point, the API call was successful (no exception thrown)
        // Redirect to success page with consultation details
        const searchParams = new URLSearchParams({
          success: "true",
          date: formattedDate,
          time: selectedTime,
        });

        router.push(`?${searchParams.toString()}`);
      }, 1500); // Show success for 1.5 seconds before redirect
    } catch (error) {
      setIsSuccess(false);

      // Extract error message - for validation errors, they're already translated in the validation layer
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("consultationErrors.create.form.error.unknown.description");

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedDate,
    selectedTime,
    selectedTimezone,
    userEmail,
    isSubmitting,
    scheduleConsultation,
    message,
    t,
    router,
  ]);

  return {
    // State
    selectedDate,
    selectedTime,
    selectedTimezone,
    message,
    isSubmitting,
    isSuccess,
    error,

    // Computed values
    timeSlots,
    canSubmit,
    hasChanges,

    // Actions
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    setMessage,
    handleSubmit,
    clearError,
  };
}

/****************************
 * CONSULTATION CALENDAR HOOK
 * Advanced hook for calendar functionality with complete state management
 ****************************/

interface UseConsultationCalendarProps {
  availabilitySlots: AvailabilitySlot[];
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled: (date: Date) => boolean;
  timezone: string;
}

interface UseConsultationCalendarReturn {
  // Calendar state
  currentMonth: Date;
  year: number;
  month: number;
  calendarDays: Date[];

  // Availability data
  availabilityByDate: Map<string, DateAvailability>;

  // Helper functions
  getDateAvailability: (date: Date) => DateAvailability;
  isDateAvailable: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateInCurrentMonth: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  isPastDate: (date: Date) => boolean;

  // Navigation
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  navigateMonth: (direction: "prev" | "next") => void;

  // Interaction
  handleDateClick: (date: Date) => void;

  // Localization
  monthNames: string[];
  dayNames: string[];
  weekStart: number;
}

/**
 * Advanced consultation calendar hook with complete calendar management
 * Handles all calendar logic including availability processing, navigation, and date selection
 */
export function useConsultationCalendar({
  availabilitySlots,
  selectedDate,
  onSelect,
  disabled,
  timezone,
}: UseConsultationCalendarProps): UseConsultationCalendarReturn {
  const { t, country } = useTranslation();

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate || new Date();
  });

  const { year, month } = useMemo(() => {
    return {
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth(),
    };
  }, [currentMonth]);

  // Process availability data by date with timezone consideration
  const availabilityByDate = useMemo(() => {
    return clientConsultationRepository.processAvailabilityByDate({
      availabilitySlots,
      timezone,
    });
  }, [availabilitySlots, timezone]);

  // Get localized week start based on country
  const weekStartDay = useMemo(() => {
    return weekdayRepository.getWeekStartForCountry(country);
  }, [country]);

  // Convert to number for calendar generation
  const weekStart = useMemo(() => {
    return weekStartDay === "MONDAY" ? 1 : 0;
  }, [weekStartDay]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return clientConsultationRepository.generateCalendarDays({
      year,
      month,
      weekStart,
    });
  }, [year, month, weekStart]);

  // Helper functions
  const getDateAvailability = useCallback(
    (date: Date): DateAvailability => {
      return clientConsultationRepository.getDateAvailability({
        date,
        availabilityMap: availabilityByDate,
        timezone,
      });
    },
    [availabilityByDate, timezone],
  );

  const isDateAvailable = useCallback(
    (date: Date): boolean => {
      return clientConsultationRepository.isDateAvailable({
        date,
        availabilityMap: availabilityByDate,
        timezone,
      });
    },
    [availabilityByDate, timezone],
  );

  const isDateSelected = useCallback(
    (date: Date): boolean => {
      if (!selectedDate) {
        return false;
      }
      return clientConsultationRepository.isSameDate(date, selectedDate);
    },
    [selectedDate],
  );

  const isDateInCurrentMonth = useCallback(
    (date: Date): boolean => {
      return clientConsultationRepository.isDateInMonth(date, month, year);
    },
    [month, year],
  );

  const isToday = useCallback((date: Date): boolean => {
    return clientConsultationRepository.isToday(date);
  }, []);

  const isPastDate = useCallback((date: Date): boolean => {
    return clientConsultationRepository.isPastDate(date);
  }, []);

  // Navigation
  const canNavigatePrev = useMemo(() => {
    return clientConsultationRepository.canNavigateToPreviousMonth(
      currentMonth,
    );
  }, [currentMonth]);

  const canNavigateNext = useMemo(() => {
    return clientConsultationRepository.canNavigateToNextMonth({
      currentMonth,
    });
  }, [currentMonth]);

  const navigateMonth = useCallback((direction: "prev" | "next"): void => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  // Interaction
  const handleDateClick = useCallback(
    (date: Date): void => {
      if (disabled?.(date) || isPastDate(date)) {
        return;
      }
      if (!isDateInCurrentMonth(date)) {
        return;
      }

      // Only allow selection of dates with available slots
      if (!isDateAvailable(date)) {
        return;
      }

      // Toggle selection - if same date is clicked, deselect it
      if (isDateSelected(date)) {
        onSelect(undefined);
      } else {
        onSelect(date);
      }
    },
    [
      disabled,
      isPastDate,
      isDateInCurrentMonth,
      isDateAvailable,
      isDateSelected,
      onSelect,
    ],
  );

  // Localization
  const monthNames = useMemo(
    () => [
      t("common.calendar.months.0"),
      t("common.calendar.months.1"),
      t("common.calendar.months.2"),
      t("common.calendar.months.3"),
      t("common.calendar.months.4"),
      t("common.calendar.months.5"),
      t("common.calendar.months.6"),
      t("common.calendar.months.7"),
      t("common.calendar.months.8"),
      t("common.calendar.months.9"),
      t("common.calendar.months.10"),
      t("common.calendar.months.11"),
    ],
    [t],
  );

  const dayNames = useMemo(() => {
    const allDayNames = [
      t("common.calendar.days.0"), // Sunday
      t("common.calendar.days.1"), // Monday
      t("common.calendar.days.2"), // Tuesday
      t("common.calendar.days.3"), // Wednesday
      t("common.calendar.days.4"), // Thursday
      t("common.calendar.days.5"), // Friday
      t("common.calendar.days.6"), // Saturday
    ];

    // Reorder based on week start preference
    const dayOrder = weekdayRepository.getLocalizedDayOrder(weekStartDay);
    return dayOrder.map((dayIndex) => allDayNames[dayIndex]);
  }, [t, weekStartDay]);

  return {
    // Calendar state
    currentMonth,
    year,
    month,
    calendarDays,

    // Availability data
    availabilityByDate,

    // Helper functions
    getDateAvailability,
    isDateAvailable,
    isDateSelected,
    isDateInCurrentMonth,
    isToday,
    isPastDate,

    // Navigation
    canNavigatePrev,
    canNavigateNext,
    navigateMonth,

    // Interaction
    handleDateClick,

    // Localization
    monthNames,
    dayNames,
    weekStart,
  };
}

/****************************
 * TIMEZONE MANAGEMENT HOOK
 * Hook for managing timezone selection and related functionality
 ****************************/

interface TimezoneOption {
  value: string;
  label: string;
  country: string;
  flag: string;
}

interface UseTimezoneManagementProps {
  locale: CountryLanguage;
  selectedTimezone: string;
}

interface UseTimezoneManagementReturn {
  timezoneOptions: TimezoneOption[];
  selectedOption: TimezoneOption | undefined;
  getDefaultTimezone: () => string;
}

/**
 * Timezone management hook for consultation scheduling
 * Handles timezone selection, options, and default timezone logic
 */
export function useTimezoneManagement({
  locale,
  selectedTimezone,
}: UseTimezoneManagementProps): UseTimezoneManagementReturn {
  const { t } = useTranslation();

  // Get timezone options
  const timezoneOptions = useMemo((): TimezoneOption[] => {
    return [
      {
        value: "Europe/Berlin",
        label: t("common.calendar.timezone.options.Europe/Berlin.label"),
        country: t("common.calendar.timezone.options.Europe/Berlin.country"),
        flag: t("common.calendar.timezone.options.Europe/Berlin.flag"),
      },
      {
        value: "Europe/Warsaw",
        label: t("common.calendar.timezone.options.Europe/Warsaw.label"),
        country: t("common.calendar.timezone.options.Europe/Warsaw.country"),
        flag: t("common.calendar.timezone.options.Europe/Warsaw.flag"),
      },
      {
        value: "Etc/UTC",
        label: t("common.calendar.timezone.options.UTC.label"),
        country: t("common.calendar.timezone.options.UTC.country"),
        flag: t("common.calendar.timezone.options.UTC.flag"),
      },
      {
        value: "America/New_York",
        label: t("common.calendar.timezone.options.America/New_York.label"),
        country: t("common.calendar.timezone.options.America/New_York.country"),
        flag: t("common.calendar.timezone.options.America/New_York.flag"),
      },
      {
        value: "America/Los_Angeles",
        label: t("common.calendar.timezone.options.America/Los_Angeles.label"),
        country: t(
          "common.calendar.timezone.options.America/Los_Angeles.country",
        ),
        flag: t("common.calendar.timezone.options.America/Los_Angeles.flag"),
      },
      {
        value: "Asia/Dubai",
        label: t("common.calendar.timezone.options.Asia/Dubai.label"),
        country: t("common.calendar.timezone.options.Asia/Dubai.country"),
        flag: t("common.calendar.timezone.options.Asia/Dubai.flag"),
      },
    ];
  }, [t]);

  const selectedOption = useMemo(() => {
    return timezoneOptions.find((option) => option.value === selectedTimezone);
  }, [timezoneOptions, selectedTimezone]);

  const _getDefaultTimezone = useCallback(() => {
    return getDefaultTimezone(locale);
  }, [locale]);

  return {
    timezoneOptions,
    selectedOption,
    getDefaultTimezone: _getDefaultTimezone,
  };
}

/****************************
 * CONSULTATION SUCCESS HOOK
 * Hook for managing consultation success page logic and actions
 ****************************/

interface UseConsultationSuccessProps {
  locale: CountryLanguage;
  scheduledDate?: string;
  scheduledTime?: string;
  businessDataCompletionStatus: BusinessDataCompletionStatus | null;
}

interface UseConsultationSuccessReturn {
  // Formatted data
  formattedDate: string;
  formattedTime: string;

  // Business data completion
  isBusinessDataComplete: boolean;
  completionPercentage: number;

  // Actions
  handleUpdate: () => void;
  handleCancel: () => void;
  handleContinue: () => void;
  navigateToBusinessInfo: () => void;
}

/**
 * Consultation success hook for managing success page logic
 * Handles formatting, business data processing, and navigation actions
 */
export function useConsultationSuccess({
  locale,
  scheduledDate,
  scheduledTime,
  businessDataCompletionStatus,
}: UseConsultationSuccessProps): UseConsultationSuccessReturn {
  const router = useRouter();

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!scheduledDate) {
      return "";
    }
    try {
      const date = new Date(scheduledDate);
      return formatDateForDisplay(date, locale);
    } catch {
      return scheduledDate;
    }
  }, [scheduledDate, locale]);

  // Format time for display
  const formattedTime = useMemo(() => {
    if (!scheduledTime) {
      return "";
    }
    return scheduledTime;
  }, [scheduledTime]);

  // Process business data completion using the utility
  const businessDataCompletion = useMemo(() => {
    return clientConsultationRepository.processBusinessDataCompletion(
      businessDataCompletionStatus,
    );
  }, [businessDataCompletionStatus]);

  const isBusinessDataComplete = businessDataCompletion.isComplete;
  const completionPercentage = businessDataCompletion.completionPercentage;

  // Action handlers
  const handleUpdate = useCallback(() => {
    router.push(`/${locale}/app/consultation/onboarding`);
  }, [router, locale]);

  const handleCancel = useCallback(() => {
    // TODO: Implement consultation cancellation API call
    // For now, just navigate back
    router.push(`/${locale}/app/onboarding`);
  }, [router, locale]);

  const handleContinue = useCallback(() => {
    router.push(`/${locale}/app/onboarding`);
  }, [router, locale]);

  const navigateToBusinessInfo = useCallback(() => {
    router.push(`/${locale}/app/business-info`);
  }, [router, locale]);

  return {
    // Formatted data
    formattedDate,
    formattedTime,

    // Business data completion
    isBusinessDataComplete,
    completionPercentage,

    // Actions
    handleUpdate,
    handleCancel,
    handleContinue,
    navigateToBusinessInfo,
  };
}
