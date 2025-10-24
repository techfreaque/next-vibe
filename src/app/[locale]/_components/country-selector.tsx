"use client";

import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";
import { getUniqueLanguages } from "@/i18n/core/language-utils";
import { cn } from "@/packages/next-vibe/shared";
import { Div, Span } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { Check } from "next-vibe-ui/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";

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
          <Span className="text-lg flex items-center justify-center my-auto">
            {currentCountry.flag}
          </Span>
          <Span
            className={cn(
              isNavBar ? "xl:flex hidden" : "flex",
              "items-center text-sm font-medium",
            )}
          >
            {currentCountry.name}
          </Span>
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
              <Span className="text-sm">{currentCountry.flag}</Span>
              {t("app.common.selector.country")}
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className={`flex items-center gap-1 ${tabHover === "language" ? "bg-primary/10" : ""}`}
              onMouseEnter={() => setTabHover("language")}
              onMouseLeave={() => setTabHover(null)}
            >
              <Span className="text-sm">{currentLanguageFlag}</Span>
              {t("app.common.selector.language")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="country" className="max-h-80 overflow-y-auto">
            <Div className="grid grid-cols-1 gap-1">
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
                  <Div className="flex items-center gap-2">
                    <Span className="text-lg mr-1">{countryItem.flag}</Span>
                    <Div className="flex flex-col items-start">
                      <Span className="font-medium">{countryItem.name}</Span>
                      <Span className="text-xs text-muted-foreground">
                        {countryItem.langName}
                      </Span>
                    </Div>
                  </Div>
                  {country === countryItem.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </Div>
          </TabsContent>

          <TabsContent value="language" className="max-h-80 overflow-y-auto">
            <Div className="grid grid-cols-1 gap-1">
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
                  <Div className="flex items-center gap-2">
                    {langInfo.countries.slice(0, 3).map((c) => (
                      <Span key={c.code} className="text-lg mr-1">
                        {c.flag}
                      </Span>
                    ))}
                    <Div className="flex flex-col items-start">
                      <Span className="font-medium">{langInfo.name}</Span>
                    </Div>
                  </Div>
                  {language === langCode && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </Div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySelector;
