/**
 * Date Picker Component
 * Date input with calendar popover
 */

"use client";

import { CalendarIcon } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useState } from "react";

import type { StyleType } from "../utils/style-type";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
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
} & StyleType;

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

/**
 * Parse YYYY-MM-DD string to Date
 */
function parseDate(dateString: string): Date | undefined {
  if (!dateString) {
    return undefined;
  }
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  className,
  style,
  name,
}: DatePickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(value));

  const handleSelect = (date: Date | undefined): void => {
    onChange(date);
    setInputValue(formatDate(date));
    setOpen(false);
  };

  const handleInputChange = (newValue: string): void => {
    setInputValue(newValue);
    const parsed = parseDate(newValue);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleInputBlur = (): void => {
    // Reformat to standard format on blur
    const parsed = parseDate(inputValue);
    setInputValue(formatDate(parsed));
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
    <div className={cn("flex", className)} style={style}>
      {/* Date input */}
      <div className="relative flex-1">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 h-10"
        />

        {/* Calendar icon button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
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
