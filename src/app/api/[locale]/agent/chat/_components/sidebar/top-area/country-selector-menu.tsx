"use client";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { Check, Globe } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { FC } from "react";
import { useCallback } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { Countries } from "@/i18n/core/config";

const CountrySelectorMenu: FC = () => {
  const { countries, currentCountry, changeLocale } = useTranslation();

  // Memoize the country change handler
  const handleCountryChange = useCallback(
    (countryCode: Countries) => {
      changeLocale(countryCode);
    },
    [changeLocale],
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Globe className="h-4 w-4 mr-2" />
        <Span className="mr-2">{currentCountry.name}</Span>
        <Span className="ml-auto">{currentCountry.flag}</Span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="max-h-[400px] overflow-y-auto">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country.code)}
            className="cursor-pointer"
          >
            <Span className="mr-2">{country.flag}</Span>
            <Span className="flex-1">{country.name}</Span>
            {currentCountry.code === country.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default CountrySelectorMenu;
