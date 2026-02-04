/**
 * DatePicker Component for React Native
 * Date input with calendar - placeholder implementation
 */
import { cn } from "next-vibe/shared/utils/utils";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

// Import all types from web (web is source of truth)
import type { DatePickerProps } from "@/packages/next-vibe-ui/web/ui/date-picker";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { Calendar as CalendarIcon } from "./icons/Calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text as UIText } from "./text";

// Re-export types for use in other modules
export type { DatePickerProps };

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
  disabled = false,
  className,
  style,
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(value));
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

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

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
  };

  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex-row", className),
      })}
    >
      {/* Date input */}
      <View className="relative flex-1">
        <Input
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          editable={!disabled}
          className="pr-12 h-12"
        />

        {/* Calendar icon button */}
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger>
            <Pressable
              disabled={disabled}
              className={cn(
                "absolute right-0 top-0 h-12 w-12 items-center justify-center",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <CalendarIcon size={16} color="#888" />
            </Pressable>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <View className="rounded-md border border-border bg-popover p-3">
              <UIText className="text-sm text-muted-foreground text-center">
                {/* eslint-disable-next-line i18next/no-literal-string -- Placeholder text */}
                {value ? value.toLocaleDateString() : "No date selected"}
              </UIText>
              <UIText className="text-xs text-muted-foreground text-center mt-2">
                {/* eslint-disable-next-line i18next/no-literal-string, oxlint-plugin-i18n/no-literal-string -- Placeholder text */}
                Calendar picker - requires native implementation
              </UIText>
            </View>
          </PopoverContent>
        </Popover>
      </View>
    </View>
  );
}
