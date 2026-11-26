/**
 * DatePicker Component for React Native
 * Date input with calendar - placeholder implementation
 */
import { useTranslation } from "next-vibe/core/i18n/core/client";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import { scopedTranslation } from "../../../unified-ui/hooks/i18n";
import {
  createCalendarDateFormatter,
  parseCalendarDate,
} from "../../../unified-ui/widgets/form-fields/date-field/local-date";
// Import all types from web (web is source of truth)
import type { DatePickerProps } from "../../web/components/date-picker";
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

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  className,
  style,
  locale,
  localizedDate = false,
  inputClassName,
  name,
  id,
  ...inputProps
}: DatePickerProps): React.JSX.Element {
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale ?? currentLocale);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string>();
  const formatter = localizedDate
    ? createCalendarDateFormatter(locale ?? currentLocale)
    : undefined;
  const inputValue =
    draft ?? (value && formatter ? formatter.format(value) : formatDate(value));
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

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
          {...inputProps}
          id={id ?? name}
          name={name}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder ?? t("widgets.formFields.common.selectDate")}
          editable={!disabled}
          className={cn("pr-12 h-12", inputClassName)}
        />

        {/* Calendar icon button */}
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger>
            <Pressable
              accessibilityLabel={t("widgets.formFields.common.openCalendar")}
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
                {/* eslint-disable-next-line i18next/no-literal-string, i18n/no-literal-string -- Placeholder text */}
                Calendar picker - requires native implementation
              </UIText>
            </View>
          </PopoverContent>
        </Popover>
      </View>
    </View>
  );
}
