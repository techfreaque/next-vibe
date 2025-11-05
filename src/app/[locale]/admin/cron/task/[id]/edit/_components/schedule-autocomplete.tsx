"use client";

/**
 * Schedule Autocomplete Component
 * Custom autocomplete for cron schedules with human-readable labels
 */
import { Check, ChevronDown, Search, X } from 'next-vibe-ui/ui/icons';
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "next-vibe-ui/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { CRON_SCHEDULES } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/constants";
import { formatCronScheduleShort } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron-formatter";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

export interface ScheduleAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  locale: CountryLanguage;
}

export function ScheduleAutocomplete({
  value = "",
  onChange,
  onBlur,
  placeholder = "Select a schedule or enter custom...",
  searchPlaceholder = "Search schedules or enter custom cron expression...",
  allowCustom = true,
  disabled = false,
  className,
  name,
  locale,
}: ScheduleAutocompleteProps): JSX.Element {
  const { t } = simpleT(locale);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCustomValue, setIsCustomValue] = useState(false);

  const timezone = getDefaultTimezone(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Generate unique ID for aria-controls
  const popoverId = React.useId();

  const options = Object.values(CRON_SCHEDULES).map((schedule) => ({
    value: schedule,
    label: formatCronScheduleShort(schedule, timezone, locale, logger),
  }));

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.value.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  // Check if current value is a custom value
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : value;

  React.useEffect(() => {
    setIsCustomValue(!selectedOption && value !== "");
  }, [selectedOption, value]);

  const handleSelect = (selectedValue: string): void => {
    onChange(selectedValue);
    setOpen(false);
    setSearchValue("");
    onBlur?.();
  };

  const handleCustomValue = (customValue: string): void => {
    onChange(customValue);
    setIsCustomValue(true);
    setOpen(false);
    setSearchValue("");
    onBlur?.();
  };

  const clearValue = (): void => {
    onChange("");
    setIsCustomValue(false);
    onBlur?.();
  };

  return (
    <Div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={popoverId}
            className={cn(
              "w-full justify-between h-10 font-normal",
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
            )}
            disabled={disabled}
          >
            <Div className="flex items-center gap-2 flex-1 min-w-0">
              {isCustomValue && (
                <Badge variant="secondary" className="text-xs">
                  {t("app.admin.cron.taskDetails.customBadge")}
                </Badge>
              )}
              <Span className="truncate">
                {value ? displayValue : placeholder}
              </Span>
            </Div>
            <Div className="flex items-center gap-1">
              {value && !disabled && (
                <button
                  type="button"
                  className="h-4 w-4 p-0 rounded-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center cursor-pointer border-0 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearValue();
                  }}
                  aria-label="Clear value"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={popoverId}
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <Div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={setSearchValue}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Div>
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <Div className="py-6 text-center text-sm">
                  <P className="text-muted-foreground">
                    {t("app.admin.cron.taskDetails.noSchedulesFound")}
                  </P>
                  {allowCustom && searchValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleCustomValue(searchValue)}
                    >
                      {t("app.admin.cron.taskDetails.useCustomSchedule", {
                        searchValue,
                      })}
                    </Button>
                  )}
                </Div>
              </CommandEmpty>

              {filteredOptions.length > 0 && (
                <CommandGroup
                  heading={t("app.admin.cron.taskDetails.commonSchedules")}
                >
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center justify-between"
                    >
                      <Span className="text-sm">{option.label}</Span>
                      {value === option.value && <Check className="h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {allowCustom && searchValue && filteredOptions.length === 0 && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleCustomValue(searchValue)}
                    className="flex items-center justify-between"
                  >
                    <Span>
                      {t("app.admin.cron.taskDetails.useCustomSchedule", {
                        searchValue,
                      })}
                    </Span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}
    </Div>
  );
}
