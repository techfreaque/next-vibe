"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { AvailabilitySlot } from "@/app/api/[locale]/v1/core/consultation/availability/schema";
import { useConsultationCalendar } from "@/app/api/[locale]/v1/core/consultation/hooks";
import { useTranslation } from "@/i18n/core/client";
import {
  getDefaultTimezone,
  getLocaleString,
} from "@/i18n/core/localization-utils";

import { TimezoneSelector } from "./timezone-selector";

interface ConsultationCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  availabilitySlots: AvailabilitySlot[];
  disabled: (date: Date) => boolean;
  className?: string;
  isLoading: boolean;
  onRefresh?: () => void;
  onTimezoneChange?: (timezone: string) => void;
  timezone: string;
  showTimezoneSelector?: boolean;
}
export function ConsultationCalendar({
  selectedDate,
  onSelect,
  availabilitySlots,
  disabled,
  className,
  isLoading,
  onRefresh,
  onTimezoneChange,
  timezone: propTimezone,
  showTimezoneSelector = false,
}: ConsultationCalendarProps): JSX.Element {
  const { t, locale } = useTranslation();
  const timezone = propTimezone || getDefaultTimezone(locale);

  // Use the consultation calendar hook for all calendar logic
  const {
    year,
    month,
    calendarDays,
    getDateAvailability,
    isDateAvailable,
    isDateSelected,
    isDateInCurrentMonth,
    isToday,
    isPastDate,
    canNavigatePrev,
    canNavigateNext,
    navigateMonth,
    handleDateClick,
    monthNames,
    dayNames,
  } = useConsultationCalendar({
    availabilitySlots,
    selectedDate,
    onSelect,
    disabled,
    timezone,
  });

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={cn("w-full shadow-lg", className)}>
        <CardHeader className="pb-4 px-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 w-20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                disabled={!canNavigatePrev}
                className="h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2 justify-center">
              <CalendarDays className="h-5 w-5 text-primary" />
              {monthNames[month]} {year}
            </CardTitle>

            <div className="flex items-center gap-1 w-20 justify-end">
              {onRefresh && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onRefresh}
                      className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("common.refresh")}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                disabled={!canNavigateNext}
                className="h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary/20 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timezone Selector */}
          {showTimezoneSelector && onTimezoneChange && (
            <div className="flex justify-center mt-3">
              <TimezoneSelector
                locale={locale}
                selectedTimezone={timezone}
                onTimezoneChange={onTimezoneChange}
                className="w-full max-w-xs"
              />
            </div>
          )}

          {timezone && !showTimezoneSelector && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
              <Clock className="h-3 w-3" />
              <span>{timezone}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 px-20">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 justify-items-center">
            {dayNames.map((day) => (
              <div
                key={day}
                className="bg-muted rounded-lg text-center text-sm font-semibold text-muted-foreground uppercase tracking-wide h-10 w-12 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 justify-items-center">
            {calendarDays.map((date, index) => {
              const inCurrentMonth = isDateInCurrentMonth(date);
              const availability = getDateAvailability(date);
              const available = isDateAvailable(date);
              const selected = isDateSelected(date);
              const today = isToday(date);
              const past = isPastDate(date);
              const isDisabled =
                disabled?.(date) || !inCurrentMonth || past || !available;

              const dayButton = (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={cn(
                    "relative h-12 w-12 text-sm font-medium rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "flex flex-col items-center justify-center",

                    // Base styles
                    inCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground",

                    // Past date styles
                    past &&
                      inCurrentMonth && [
                        "text-muted-foreground bg-muted/50 cursor-not-allowed",
                        "border border-border/50",
                      ],

                    // Available styles
                    available &&
                      inCurrentMonth &&
                      !past &&
                      !selected && [
                        "bg-emerald-100 bg-gradient-to-br from-emerald-100 to-green-100 dark:bg-emerald-900/40 dark:from-emerald-900/40 dark:to-green-900/40",
                        "border-2 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
                        "hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-800/50 dark:hover:to-green-800/50",
                        "hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg",
                        "cursor-pointer transform hover:scale-105",
                      ],

                    // Selected styles
                    selected && [
                      "bg-primary bg-gradient-to-br from-primary to-primary/90",
                      "text-primary-foreground border-2 border-primary",
                      "hover:from-primary/90 hover:to-primary/80",
                      "shadow-xl transform scale-110",
                    ],

                    // Today styles (when not selected)
                    today &&
                      !selected &&
                      inCurrentMonth && [
                        "ring-2 ring-primary/50 ring-offset-2",
                      ],

                    // Unavailable but in current month
                    !available &&
                      inCurrentMonth &&
                      !past && [
                        "text-muted-foreground bg-muted/30 cursor-not-allowed",
                        "border border-border/30",
                      ],

                    // Out of month styles
                    !inCurrentMonth && [
                      "opacity-20 cursor-not-allowed bg-muted/20",
                    ],
                  )}
                >
                  <span className="text-sm font-semibold">
                    {date.getDate()}
                  </span>

                  {/* Availability indicator */}
                  {available && inCurrentMonth && !past && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "absolute -bottom-1 -right-1 h-5 w-5 p-0 text-xs font-bold",
                        "flex items-center justify-center rounded-full",
                        selected
                          ? "bg-primary-foreground text-primary"
                          : "bg-green-600 dark:bg-green-500 text-white",
                      )}
                    >
                      {availability.available}
                    </Badge>
                  )}

                  {/* Today indicator */}
                  {today && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              );

              // Wrap available dates with tooltip
              if (available && inCurrentMonth && !past) {
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>{dayButton}</TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {availability.available}{" "}
                        {availability.available === 1
                          ? t("common.calendar.slot.singular")
                          : t("common.calendar.slot.plural")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {date.toLocaleDateString(getLocaleString(locale))}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return dayButton;
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-emerald-100 bg-gradient-to-br from-emerald-100 to-green-100 dark:bg-emerald-900/40 dark:from-emerald-900/40 dark:to-green-900/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-md" />
              <span className="text-foreground font-medium">
                {t("common.calendar.status.available")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-primary bg-gradient-to-br from-primary to-primary/90 rounded-md shadow-md" />
              <span className="text-foreground font-medium">
                {t("common.calendar.status.selected")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-muted/30 border border-border/30 rounded-md relative">
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
              <span className="text-foreground font-medium">
                {t("common.calendar.status.today")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
