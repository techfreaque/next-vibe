/**
 * Date Picker Component
 * Date input with calendar popover
 */

"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CalendarIcon } from "next-vibe/ui/components/icons/CalendarIcon";
import type { JSX, Ref } from "react";
import { useState } from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import { scopedTranslation } from "../../../unified-ui/hooks/i18n";
import {
  createCalendarDateDisplayFormatter,
  createCalendarDateFormatter,
  parseCalendarDate,
} from "../../../unified-ui/widgets/form-fields/date-field/local-date";
import type { StyleType } from "../utils/style-type";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input, type InputProps, type InputRefObject } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  name?: string;
  locale?: CountryLanguage;
  /**
   * Show the date in the viewer's locale ("26 Nov 2026", "26. Nov. 2026")
   * while the value stays a calendar day. Default true; false shows ISO.
   */
  localizedDate?: boolean;
  inputClassName?: string;
  ref?: Ref<InputRefObject>;
} & Pick<
  InputProps<"text">,
  "id" | "aria-label" | "aria-describedby" | "aria-invalid"
> &
  StyleType;

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  className,
  style,
  name,
  locale,
  localizedDate = true,
  inputClassName,
  id,
  ...inputProps
}: DatePickerProps): JSX.Element {
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale ?? currentLocale);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string>();
  const formatter = localizedDate
    ? createCalendarDateFormatter(locale ?? currentLocale)
    : undefined;
  const displayFormatter = localizedDate
    ? createCalendarDateDisplayFormatter(locale ?? currentLocale)
    : undefined;
  const inputValue =
    draft ??
    (value && displayFormatter
      ? displayFormatter.format(value)
      : formatDate(value));

  const handleSelect = (date: Date | undefined): void => {
    onChange(date);
    setDraft(undefined);
    setOpen(false);
  };

  const handleInputChange = (newValue: string): void => {
    setDraft(newValue);
    const parsed = parseCalendarDate(newValue, formatter);
    if (parsed || !newValue) {
      onChange(parsed);
    }
  };

  const handleInputBlur = (): void => {
    setDraft(undefined);
    if (onBlur) {
      onBlur();
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return false;
  };

  return (
    <div className={cn("flex min-w-0", className)} style={style}>
      {/* Date input */}
      <div className="relative min-w-0 flex-1">
        <Input
          type="text"
          {...inputProps}
          id={id ?? name}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          placeholder={placeholder ?? t("widgets.formFields.common.selectDate")}
          disabled={disabled}
          className={cn("pr-10 h-10 w-full", inputClassName)}
        />

        {/* Calendar icon button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              aria-label={t("widgets.formFields.common.openCalendar")}
              variant="ghost"
              className={cn(
                "absolute right-0 top-0 h-10 w-10 p-0",
                disabled && "cursor-not-allowed opacity-50",
              )}
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              disabled={isDateDisabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={formatDate(value)} />}
    </div>
  );
}
