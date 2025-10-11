"use client";

import { Clock, Globe } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import type { JSX } from "react";

import { useTimezoneManagement } from "@/app/api/[locale]/v1/core/consultation/hooks";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCurrentTimeInTimezone } from "@/i18n/core/localization-utils";

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  className?: string;
  locale: CountryLanguage;
}

export function TimezoneSelector({
  selectedTimezone,
  onTimezoneChange,
  className,
  locale,
}: TimezoneSelectorProps): JSX.Element {
  const { t } = useTranslation();

  // Use the timezone management hook
  const { timezoneOptions, selectedOption } = useTimezoneManagement({
    locale,
    selectedTimezone,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start gap-2 h-auto py-2 px-3",
            "hover:bg-primary/10 hover:border-primary/30 transition-colors",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedOption?.flag}</span>
                <span className="font-medium text-sm">
                  {selectedOption?.label || selectedTimezone}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {getCurrentTimeInTimezone(selectedTimezone, locale)}
                </span>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t("common.calendar.timezone.select")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {timezoneOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onTimezoneChange(option.value)}
            className={cn(
              "flex items-center justify-between py-3 cursor-pointer",
              selectedTimezone === option.value && "bg-primary/10 text-primary",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{option.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.country}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{getCurrentTimeInTimezone(option.value, locale)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
