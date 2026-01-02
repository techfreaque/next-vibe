/**
 * PhoneField Component for React Native
 * Production-ready international phone input with country code selection
 */
import { cn } from "next-vibe/shared/utils/utils";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";
// Import all types and constants from web (web is source of truth)
import type { CountryData, PhoneFieldProps } from "@/packages/next-vibe-ui/web/ui/phone-field";
import { COUNTRIES } from "@/packages/next-vibe-ui/web/ui/phone-field";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { ChevronDown, Phone } from "./icons";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text as UIText } from "./text";

// Re-export COUNTRIES and types for use in other modules
export { COUNTRIES };
export type { CountryData, PhoneFieldProps };

export function PhoneField({
  value = "",
  onChange,
  onBlur,
  placeholder = "Enter phone number",
  defaultCountry = "US",
  preferredCountries = [],
  disabled = false,
  className,
  style,
}: PhoneFieldProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Parse the current value to extract country and number
  const parsePhoneValue = (phoneValue: string): { country: string; number: string } => {
    if (!phoneValue) {
      return {
        country: defaultCountry || "US",
        number: "",
      };
    }

    // Find matching country by prefix
    const matchingCountry = COUNTRIES.find((country: CountryData) =>
      phoneValue.startsWith(country.prefix),
    );

    if (matchingCountry) {
      return {
        country: matchingCountry.code,
        number: phoneValue.slice(matchingCountry.prefix.length).trim(),
      };
    }

    return { country: defaultCountry || "US", number: phoneValue };
  };

  const { country: selectedCountry, number: phoneNumber } = parsePhoneValue(value);
  const currentCountry =
    COUNTRIES.find((c: CountryData) => c.code === selectedCountry) || COUNTRIES[0];

  // Organize countries with preferred ones first
  const organizedCountries = useMemo(() => {
    const preferred = COUNTRIES.filter((country: CountryData) =>
      preferredCountries.includes(country.code),
    );
    const others = COUNTRIES.filter(
      (country: CountryData) => !preferredCountries.includes(country.code),
    );
    return { preferred, others };
  }, [preferredCountries]);

  const handleCountrySelect = (countryCode: string): void => {
    const newCountry = COUNTRIES.find((c: CountryData) => c.code === countryCode);
    if (newCountry) {
      const newValue = phoneNumber ? `${newCountry.prefix} ${phoneNumber}` : newCountry.prefix;
      onChange(newValue);
    }
    setOpen(false);
  };

  const handleNumberChange = (newNumber: string): void => {
    // Remove any non-digit characters except spaces and dashes
    const cleanNumber = newNumber.replaceAll(/[^\d\s-]/g, "");
    const newValue = cleanNumber ? `${currentCountry.prefix} ${cleanNumber}` : "";
    onChange(newValue);
  };

  const renderCountryItem = (country: CountryData): React.JSX.Element => (
    <Pressable
      key={country.code}
      onPress={() => handleCountrySelect(country.code)}
      className="flex-row items-center justify-between px-3 py-3 active:bg-accent"
    >
      <View className="flex-row items-center gap-2">
        <UIText className="text-lg">{country.flag}</UIText>
        <UIText className="text-base">{country.name}</UIText>
      </View>
      <UIText className="text-sm text-muted-foreground">{country.prefix}</UIText>
    </Pressable>
  );

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
      {/* Country selector */}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <Pressable
            disabled={disabled}
            className={cn(
              "w-[120px] h-12 flex-row items-center justify-between rounded-l-md border border-input border-r-0 bg-background px-3 py-2",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <View className="flex-row items-center gap-2">
              <UIText className="text-lg">{currentCountry.flag}</UIText>
              <UIText className="text-sm">{currentCountry.prefix}</UIText>
            </View>
            <ChevronDown size={16} color="#888" />
          </Pressable>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <View className="rounded-md border border-border bg-popover">
            <ScrollView className="max-h-[300px]">
              {organizedCountries.preferred.length > 0 && (
                <View className="border-b border-border">
                  <UIText className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                    {t("packages.nextVibeUi.native.ui.phoneField.preferred")}
                  </UIText>
                  {organizedCountries.preferred.map(renderCountryItem)}
                </View>
              )}

              <View>
                <UIText className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                  {t("packages.nextVibeUi.native.ui.phoneField.allCountries")}
                </UIText>
                {organizedCountries.others.map(renderCountryItem)}
              </View>
            </ScrollView>
          </View>
        </PopoverContent>
      </Popover>

      {/* Phone number input */}
      <View className="relative flex-1">
        <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Phone size={16} color="#888" />
        </View>
        <Input
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleNumberChange}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={!disabled}
          className="rounded-l-none pl-10 h-12"
        />
      </View>
    </View>
  );
}
