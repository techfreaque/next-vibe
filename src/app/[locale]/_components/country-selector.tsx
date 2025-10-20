"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";
import { getUniqueLanguages } from "@/i18n/core/language-utils";

interface CountrySelectorProps {
  isNavBar?: boolean;
  locale: CountryLanguage;
}

const CountrySelector: FC<CountrySelectorProps> = ({ isNavBar }) => {
  const {
    countries,
    currentCountry,
    changeLocale,
    language,
    country,
    setLanguage,
    t,
  } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"country" | "language">("country");
  const [tabHover, setTabHover] = useState<"country" | "language" | null>(null);

  // Memoize the language change handler to prevent infinite loops
  const handleLanguageChange = useCallback(
    (langCode: Languages) => {
      setLanguage(langCode);
      setIsOpen(false);
    },
    [setLanguage],
  );

  // Memoize the country change handler
  const handleCountryChange = useCallback(
    (countryCode: Countries) => {
      changeLocale(countryCode);
      setIsOpen(false);
    },
    [changeLocale],
  );

  const currentLanguageFlag = countries.find(
    (c) => c.language === language,
  )?.flag;

  // Get unique languages from countries using the singleton utility
  const uniqueLanguages = getUniqueLanguages();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="unset"
          className={cn(
            "flex items-center justify-center h-10",
            isNavBar
              ? "w-10 xl:w-auto xl:px-4 xl:py-2 xl:flex-wrap xl:content-center xl:gap-2"
              : "px-3 rounded-md border",
          )}
        >
          <span className="text-lg flex items-center justify-center my-auto">
            {currentCountry.flag}
          </span>
          <span
            className={cn(
              isNavBar ? "xl:flex hidden" : "flex",
              "items-center text-sm font-medium",
            )}
          >
            {currentCountry.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <Tabs
          defaultValue="country"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "country" | "language")
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger
              value="country"
              className={`flex items-center gap-1 ${tabHover === "country" ? "bg-primary/10" : ""}`}
              onMouseEnter={() => setTabHover("country")}
              onMouseLeave={() => setTabHover(null)}
            >
              {/* <GlobeIcon className="h-4 w-4" /> */}
              <span className="text-sm">{currentCountry.flag}</span>
              {t("app.common.selector.country")}
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className={`flex items-center gap-1 ${tabHover === "language" ? "bg-primary/10" : ""}`}
              onMouseEnter={() => setTabHover("language")}
              onMouseLeave={() => setTabHover(null)}
            >
              <span className="text-sm">{currentLanguageFlag}</span>
              {t("app.common.selector.language")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="country" className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {countries.map((countryItem) => (
                <Button
                  key={countryItem.code}
                  variant="ghost"
                  className={`flex items-center justify-between w-full h-auto py-2 px-3 hover:bg-accent transition-colors ${
                    country === countryItem.code ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    // Change locale (country) and also set the language to match the country's default language
                    handleCountryChange(countryItem.code);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg mr-1">{countryItem.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{countryItem.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {countryItem.langName}
                      </span>
                    </div>
                  </div>
                  {country === countryItem.code && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="language" className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {uniqueLanguages.map(([langCode, langInfo]) => (
                <Button
                  key={langCode}
                  variant="ghost"
                  className={`flex items-center justify-between w-full h-auto py-2 px-3 hover:bg-accent transition-colors ${
                    language === langCode ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    handleLanguageChange(langCode);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {langInfo.countries.slice(0, 3).map((c) => (
                      <span key={c.code} className="text-lg mr-1">
                        {c.flag}
                      </span>
                    ))}
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{langInfo.name}</span>
                    </div>
                  </div>
                  {language === langCode && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySelector;
