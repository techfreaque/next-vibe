"use client";
import type { Route } from "next";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE_NAME } from "next-vibe/shared/constants";
import type { JSX, ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";

import { setCookie } from "@/app/api/[locale]/v1/core/system/unified-ui/react/storage/cookie-client";

import { languageConfig } from "..";
import type { CountryInfo, CountryLanguage } from "./config";
import {
  availableCountries,
  Countries,
  defaultLocaleConfig,
  globalCountryInfo,
  Languages,
} from "./config";
import type {
  TFunction,
  TParams,
  TranslationKey,
  TranslationValue,
} from "./static-types";
import { renderTranslation, translateKey } from "./translation-utils";

// Translation context type with country support
interface TranslationContextType {
  language: Languages;
  country: Countries;
  locale: CountryLanguage;
  setLanguage: (lang: Languages) => void;
  setCountry: (country: Countries) => void;
  t: TFunction;
  isRTL: boolean;
  countries: readonly CountryInfo[];
  currentCountry: CountryInfo;
  changeLocale: (country: Countries) => void;
}

// Create context with default values
export const TranslationContext = createContext<TranslationContextType>({
  language: defaultLocaleConfig.language,
  country: defaultLocaleConfig.country,
  locale: `${defaultLocaleConfig.language}-${defaultLocaleConfig.country}`,
  setLanguage: () => {},
  setCountry: () => {},
  t: (<K extends TranslationKey>(
    key: K,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params?: TranslationValue<TranslationKey> extends string
      ? Record<string, string | number>
      : never,
  ) => key) as TFunction,
  isRTL: false,
  countries: availableCountries,
  currentCountry: globalCountryInfo,
  changeLocale: () => {},
});

// Translation provider props
interface TranslationProviderProps {
  children: ReactNode;
  currentLocale?: CountryLanguage;
}

// Translation provider component
export function TranslationProvider({
  children,
  currentLocale,
}: TranslationProviderProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);

  // Extract language and country from current locale (from route)
  const currentLanguage =
    (currentLocale?.split("-")[0] as Languages) || defaultLocaleConfig.language;
  const currentCountryCode =
    (currentLocale?.split("-")[1] as Countries) || defaultLocaleConfig.country;

  // Use current locale from route - no internal state needed
  const language = currentLanguage;
  const country = currentCountryCode;

  // Find the current country info
  const currentCountry =
    availableCountries.find((c) => c.code === country) ||
    availableCountries.find((c) => c.code === Countries.GLOBAL) ||
    globalCountryInfo;

  // Custom setLanguage that also updates the URL and cookies
  const setLanguage = (lang: Languages): void => {
    if (!mounted) {
      return;
    }

    const newLocale = `${lang}-${country}`;

    // Save to localStorage and cookie
    localStorage.setItem(LOCALE_COOKIE_NAME, newLocale);
    setCookie(LOCALE_COOKIE_NAME, newLocale);

    // Update URL to reflect language change
    if (pathname) {
      const pathSegments = pathname.split("/");
      if (pathSegments.length > 1 && pathSegments[1]) {
        const currentLocaleInPath = pathSegments[1];
        const newPath = pathname.replace(
          `/${currentLocaleInPath}`,
          `/${newLocale}`,
        ) as Route<RouteType>;
        router.push(newPath);
      }
    }
  };

  // Custom setCountry that also updates localStorage and cookies
  const setCountry = (newCountry: Countries): void => {
    if (!mounted) {
      return;
    }

    const newLocale = `${language}-${newCountry}`;

    // Save to localStorage and cookie
    localStorage.setItem(LOCALE_COOKIE_NAME, newLocale);
    setCookie(LOCALE_COOKIE_NAME, newLocale);

    // Update URL to reflect country change
    if (pathname) {
      const pathSegments = pathname.split("/");
      if (pathSegments.length > 1 && pathSegments[1]) {
        const currentLocaleInPath = pathSegments[1];
        const newPath = pathname.replace(
          `/${currentLocaleInPath}`,
          `/${newLocale}`,
        ) as Route<RouteType>;
        router.push(newPath);
      }
    }
  };

  // Function to change both country and language at once
  const changeLocale = (newCountry: Countries): void => {
    setCountry(newCountry);
    const countryInfo = languageConfig.countryInfo[newCountry];
    setLanguage(countryInfo.language as Languages);
    const newLocale = `${countryInfo.language}-${newCountry}`;
    setCookie(LOCALE_COOKIE_NAME, newLocale);
    localStorage.setItem(LOCALE_COOKIE_NAME, newLocale);
    router.push(`/${newLocale}${pathname.replace(`/${currentLocale}`, "")}`);
  };

  // Simple mount effect - only save current locale if none exists
  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") {
      return;
    }

    // Only save to localStorage if no preference exists (respect existing localStorage)
    const savedLocale = localStorage.getItem(LOCALE_COOKIE_NAME);
    if (!savedLocale && currentLocale) {
      localStorage.setItem(LOCALE_COOKIE_NAME, currentLocale);
      setCookie(LOCALE_COOKIE_NAME, currentLocale);
    }

    // Update document language for accessibility
    document.documentElement.lang = language;
  }, [currentLocale, language]);

  // Type-safe translation function with parameter support
  const t: TFunction = <K extends TranslationKey>(
    key: K,
    params?: TParams,
  ): string => {
    // Use the shared translation utility with client context
    return translateKey(
      key,
      language,
      params,
      Languages.EN, // Use EN as fallback language

      "Client",
    );
  };

  // Check if the language is RTL (for future support of languages like Arabic, Hebrew)
  const isRTL = false; // Currently all supported languages are LTR

  return (
    <TranslationContext.Provider
      value={{
        language,
        country,
        setLanguage,
        setCountry,
        locale: `${language}-${country}`,
        t,
        isRTL,
        countries: availableCountries,
        currentCountry,
        changeLocale,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translations
export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);

  if (!context) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return context;
}

// Type-safe Trans component for JSX translations
interface TransProps<K extends TranslationKey> {
  i18nKey: K;
  values?: TranslationValue<K> extends string
    ? Record<string, string | number>
    : never;
}

export function Trans<K extends TranslationKey>({
  i18nKey,
  values,
}: TransProps<K>): JSX.Element {
  const { t } = useTranslation();

  // Use the t function which already uses the shared utility
  const translatedValue = t(i18nKey, values);

  // Use the shared rendering logic
  return <>{renderTranslation(translatedValue, i18nKey)}</>;
}
