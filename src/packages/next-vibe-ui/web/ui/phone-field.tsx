/**
 * Phone Field Component
 * International phone input with country code selection
 */

"use client";

import { ChevronDown, Phone } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import { Countries } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Common country codes and their phone prefixes
const COUNTRIES = [
  { code: "US", name: "United States", prefix: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", prefix: "+1", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", prefix: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", prefix: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", prefix: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", prefix: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", prefix: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", prefix: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", prefix: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", prefix: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", prefix: "+43", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", prefix: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", prefix: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", prefix: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", prefix: "+358", flag: "🇫🇮" },
  { code: "PL", name: "Poland", prefix: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", prefix: "+420", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", prefix: "+36", flag: "🇭🇺" },
  { code: "PT", name: "Portugal", prefix: "+351", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", prefix: "+353", flag: "🇮🇪" },
  { code: "AU", name: "Australia", prefix: "+61", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", prefix: "+64", flag: "🇳🇿" },
  { code: "JP", name: "Japan", prefix: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", prefix: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", prefix: "+86", flag: "🇨🇳" },
  { code: "IN", name: "India", prefix: "+91", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", prefix: "+65", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", prefix: "+852", flag: "🇭🇰" },
  { code: "BR", name: "Brazil", prefix: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", prefix: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", prefix: "+54", flag: "🇦🇷" },
  { code: "ZA", name: "South Africa", prefix: "+27", flag: "🇿🇦" },
] as const;

export interface PhoneFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: TranslationKey;
  defaultCountry: Countries;
  preferredCountries: Countries[];
  disabled?: boolean;
  className?: string;
  name: string;
}

export function PhoneField({
  value = "",
  onChange,
  onBlur,
  placeholder = "common.enterPhoneNumber",
  defaultCountry,
  preferredCountries,
  disabled = false,
  className,
  name,
}: PhoneFieldProps): JSX.Element {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Parse the current value to extract country and number
  const parsePhoneValue = (
    phoneValue: string,
  ): { country: string; number: string } => {
    if (!phoneValue) {
      return {
        country: defaultCountry === Countries.GLOBAL ? "US" : defaultCountry,
        number: "",
      };
    }

    // Find matching country by prefix
    const matchingCountry = COUNTRIES.find((country) =>
      phoneValue.startsWith(country.prefix),
    );

    if (matchingCountry) {
      return {
        country: matchingCountry.code,
        number: phoneValue.slice(matchingCountry.prefix.length).trim(),
      };
    }

    return { country: defaultCountry, number: phoneValue };
  };

  const { country: selectedCountry, number: phoneNumber } =
    parsePhoneValue(value);
  const currentCountry =
    COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  // Organize countries with preferred ones first
  const organizedCountries = useMemo(() => {
    const preferred = COUNTRIES.filter((country) =>
      (preferredCountries as string[]).includes(country.code),
    );
    const others = COUNTRIES.filter(
      (country) => !(preferredCountries as string[]).includes(country.code),
    );
    return { preferred, others };
  }, [preferredCountries]);

  const handleCountrySelect = (countryCode: string): void => {
    const newCountry = COUNTRIES.find((c) => c.code === countryCode);
    if (newCountry) {
      const newValue = phoneNumber
        ? `${newCountry.prefix} ${phoneNumber}`
        : newCountry.prefix;
      onChange(newValue);
    }
    setOpen(false);
  };

  const handleNumberChange = (newNumber: string): void => {
    // Remove any non-digit characters except spaces and dashes
    const cleanNumber = newNumber.replace(/[^\d\s-]/g, "");
    const newValue = cleanNumber
      ? `${currentCountry.prefix} ${cleanNumber}`
      : "";
    onChange(newValue);
  };

  return (
    <div className={cn("flex", className)}>
      {/* Country selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[120px] justify-between rounded-r-none border-r-0 h-10",
              disabled && "cursor-not-allowed opacity-50",
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentCountry.flag}</span>
              <span className="text-sm">{currentCountry.prefix}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t("common.searchCountries")} />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>{t("common.noCountryFound")}</CommandEmpty>

              {organizedCountries.preferred.length > 0 && (
                <CommandGroup heading={t("common.preferred")}>
                  {organizedCountries.preferred.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.prefix}`}
                      onSelect={() => handleCountrySelect(country.code)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {country.prefix}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup heading={t("common.allCountries")}>
                {organizedCountries.others.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.prefix}`}
                    onSelect={() => handleCountrySelect(country.code)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {country.prefix}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Phone number input */}
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          onBlur={onBlur}
          placeholder={t(placeholder)}
          disabled={disabled}
          className="rounded-l-none pl-10 h-10"
        />
      </div>

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
