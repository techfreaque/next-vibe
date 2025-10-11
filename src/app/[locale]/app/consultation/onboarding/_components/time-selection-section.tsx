"use client";

import { Clock } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import type { AvailabilityResponseType } from "@/app/api/[locale]/v1/core/consultation/availability/schema";
import type { TimeSlot } from "@/app/api/[locale]/v1/core/consultation/client-repository";
import { useTranslation } from "@/i18n/core/client";

interface TimeSelectionSectionProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  timeSlots: TimeSlot[];
  availability: AvailabilityResponseType | null;
}

export function TimeSelectionSection({
  selectedDate,
  selectedTime,
  onTimeSelect,
  timeSlots,
  availability,
}: TimeSelectionSectionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
        <Clock className="h-5 w-5" />
        {t("onboarding.consultation.schedule.selectTime")}
      </h3>

      {selectedDate ? (
        availability ? (
          timeSlots.length === 0 ? (
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
              <CardContent className="py-6 text-center">
                <p className="text-orange-700 dark:text-orange-300">
                  {t("onboarding.consultation.schedule.noSlots")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => onTimeSelect(slot.time)}
                  className={`h-12 ${
                    selectedTime === slot.time
                      ? "bg-primary hover:bg-primary/90"
                      : slot.available
                        ? "hover:bg-primary/10 hover:border-primary/30"
                        : "opacity-50"
                  }`}
                >
                  {slot.formatted}
                </Button>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )
      ) : (
        <Card className="bg-muted">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {t("onboarding.consultation.schedule.selectDateFirst")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
