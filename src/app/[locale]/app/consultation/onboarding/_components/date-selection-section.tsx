"use client";

import { CalendarDays } from "lucide-react";
import type { JSX } from "react";

import type { AvailabilitySlot } from "@/app/api/[locale]/v1/core/consultation/availability/schema";
import { useTranslation } from "@/i18n/core/client";

import { ConsultationCalendar } from "./consultation-calendar";

interface DateSelectionSectionProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  availabilitySlots: AvailabilitySlot[];
  disabled: (date: Date) => boolean;
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function DateSelectionSection({
  selectedDate,
  onSelect,
  availabilitySlots,
  disabled,
  selectedTimezone,
  onTimezoneChange,
}: DateSelectionSectionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
        <CalendarDays className="h-5 w-5" />
        {t("onboarding.consultation.schedule.selectDate")}
      </h3>
      <div className="w-full">
        <ConsultationCalendar
          selectedDate={selectedDate}
          onSelect={onSelect}
          availabilitySlots={availabilitySlots}
          disabled={disabled}
          isLoading={false}
          timezone={selectedTimezone}
          onTimezoneChange={onTimezoneChange}
          showTimezoneSelector={true}
          className="w-full"
        />
      </div>
    </div>
  );
}
