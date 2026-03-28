"use client";
import type { Route } from "next";
import { usePathname, useRouter } from "next-vibe-ui/hooks/use-navigation";
import { setCookie } from "next-vibe-ui/lib/cookies";
import { storage } from "next-vibe-ui/lib/storage";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import type { JSX, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { LOCALE_COOKIE_NAME } from "@/config/constants";

import { languageConfig } from "..";
import type { CountryInfo, CountryLanguage, Languages } from "./config";
import {
  availableCountries,
  Countries,
  defaultLocaleConfig,
  globalCountryInfo,
} from "./config";

// Translation context type with country support
interface TranslationContextType {
  language: Languages;
  country: Countries;
  locale: CountryLanguage;
  setLanguage: (lang: Languages) => void;
  setCountry: (country: Countries) => void;
  countries: readonly CountryInfo[];
  currentCountry: CountryInfo;
  changeLocale: (country: Countries) => void;
}

// Default no-op handlers for context initialization
function defaultSetLanguage(): void {
  // No-op default - overridden by provider
}

function defaultSetCountry(): void {
  // No-op default - overridden by provider
}

function defaultChangeLocale(): void {
  // No-op default - overridden by provider
}

// Create context with default values
export const TranslationContext = createContext<TranslationContextType>({
  language: defaultLocaleConfig.language,
  country: defaultLocaleConfig.country,
  locale: `${defaultLocaleConfig.language}-${defaultLocaleConfig.country}`,
  setLanguage: defaultSetLanguage,
  setCountry: defaultSetCountry,
  countries: availableCountries,
  currentCountry: globalCountryInfo,
  changeLocale: defaultChangeLocale,
});

// Translation provider props
interface TranslationProviderProps {
  children: ReactNode;
  currentLocale: CountryLanguage;
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
  const setLanguage = async (lang: Languages): Promise<void> => {
    if (!mounted) {
      return;
    }

    const newLocale = `${lang}-${country}`;

    // Save to storage
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale);
    await setCookie(LOCALE_COOKIE_NAME, newLocale);

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
  const setCountry = async (newCountry: Countries): Promise<void> => {
    if (!mounted) {
      return;
    }

    const newLocale = `${language}-${newCountry}`;

    // Save to storage
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale);
    await setCookie(LOCALE_COOKIE_NAME, newLocale);

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
  const changeLocale = async (newCountry: Countries): Promise<void> => {
    await setCountry(newCountry);
    const countryInfo = languageConfig.countryInfo[newCountry];
    await setLanguage(countryInfo.language as Languages);
    const newLocale = `${countryInfo.language}-${newCountry}`;
    await setCookie(LOCALE_COOKIE_NAME, newLocale);
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale);

    router.push(`/${newLocale}${pathname.replace(`/${currentLocale}`, "")}`);
  };

  // Simple mount effect - only save current locale if none exists
  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") {
      return;
    }
    async function initializeLocale(): Promise<void> {
      // Only save to localStorage if no preference exists (respect existing localStorage)
      const savedLocale = await storage.getItem(LOCALE_COOKIE_NAME);
      if (!savedLocale && currentLocale) {
        await storage.setItem(LOCALE_COOKIE_NAME, currentLocale);
        await setCookie(LOCALE_COOKIE_NAME, currentLocale);
      }

      // Update document language for accessibility (web only)
      if (typeof document !== "undefined") {
        const newLocale = savedLocale ?? currentLocale;
        if (newLocale !== document.documentElement.lang) {
          document.documentElement.lang = newLocale;
        }
      }
    }
    void initializeLocale();
  }, [currentLocale, language, country]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        country,
        setLanguage,
        setCountry,
        locale: `${language}-${country}`,
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
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Critical initialization error: Context must exist for i18n to function
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return context;
}
