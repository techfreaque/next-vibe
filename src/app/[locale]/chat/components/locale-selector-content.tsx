"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { Check } from "next-vibe-ui/ui/icons";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { Countries, CountryInfo, Languages } from "@/i18n/core/config";
import { getUniqueLanguages } from "@/i18n/core/language-utils";

export const LocaleSelectorContent: FC = () => {
  const translationContext = useTranslation();
  const countries: readonly CountryInfo[] = translationContext.countries;
  const currentCountry: CountryInfo = translationContext.currentCountry;
  const changeLocale: (country: Countries) => void =
    translationContext.changeLocale;
  const language: Languages = translationContext.language;
  const country: Countries = translationContext.country;
  const setLanguage: (lang: Languages) => void = translationContext.setLanguage;
  const t = translationContext.t;
  const [activeTab, setActiveTab] = useState<"country" | "language">("country");
  const [tabHover, setTabHover] = useState<"country" | "language" | null>(null);

  // Memoize the language change handler to prevent infinite loops
  const handleLanguageChange = useCallback(
    (langCode: Languages) => {
      setLanguage(langCode);
    },
    [setLanguage],
  );

  // Memoize the country change handler
  const handleCountryChange = useCallback(
    (countryCode: Countries) => {
      changeLocale(countryCode);
    },
    [changeLocale],
  );

  const uniqueLanguages = getUniqueLanguages();
  const currentLanguageFlag =
    uniqueLanguages.find(([code]) => code === language)?.[1].countries[0]
      ?.flag || currentCountry.flag;

  return (
    <Div className="w-72 p-2">
      <Tabs
        defaultValue="country"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "country" | "language")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger
            value="country"
            className={`flex items-center gap-1 ${tabHover === "country" ? "bg-primary/10" : ""}`}
            onMouseEnter={() => setTabHover("country")}
            onMouseLeave={() => setTabHover(null)}
          >
            <Span className="text-sm">{currentCountry.flag}</Span>
            {t("app.chat.common.selector.country")}
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className={`flex items-center gap-1 ${tabHover === "language" ? "bg-primary/10" : ""}`}
            onMouseEnter={() => setTabHover("language")}
            onMouseLeave={() => setTabHover(null)}
          >
            <Span className="text-sm">{currentLanguageFlag}</Span>
            {t("app.chat.common.selector.language")}
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
    </Div>
  );
};
