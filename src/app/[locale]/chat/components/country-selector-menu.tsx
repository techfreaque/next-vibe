"use client";

import { CheckIcon, Globe } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
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
        <span className="mr-2">{currentCountry.name}</span>
        <span className="ml-auto">{currentCountry.flag}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="max-h-[400px] overflow-y-auto">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{country.flag}</span>
            <span className="flex-1">{country.name}</span>
            {currentCountry.code === country.code && (
              <CheckIcon className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default CountrySelectorMenu;
