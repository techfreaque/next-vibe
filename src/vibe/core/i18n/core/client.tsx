"use client";
import type { Route } from "next";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { usePathname } from "next-vibe/ui/hooks/use-pathname";
import { setCookie } from "next-vibe/ui/lib/cookies";
import { setDocumentLang } from "next-vibe/ui/lib/css-vars";
import { assignUrl } from "next-vibe/ui/lib/location";
import { storage } from "next-vibe/ui/lib/storage";
import {
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { z } from "zod";

import { LOCALE_COOKIE_NAME } from "@/env/constants";

import { languageConfig } from "..";
import type { CountryInfo, CountryLanguage, Languages } from "./config";
import {
  availableCountries,
  Countries,
  CountryLanguageValues,
  defaultLocaleConfig,
  globalCountryInfo,
} from "./config";
import {
  getLanguageAndCountryFromLocale,
  languageForCountry,
} from "./language-utils";

// Translation context type with country support
interface TranslationContextType {
  language: Languages;
  country: Countries;
  locale: CountryLanguage;
  setLanguage: (lang: Languages) => void;
  setCountry: (country: Countries) => void;
  countries: readonly CountryInfo[];
  currentCountry: CountryInfo;
  changeLocale: (country: Countries, language?: Languages) => void;
  /** Set language and region together, in one navigation, unconstrained. */
  setLocale: (locale: CountryLanguage) => void;
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

function defaultSetLocale(): void {
  // No-op default - overridden by provider
}

// Create context with default values
const TranslationContext = createContext<TranslationContextType>({
  language: defaultLocaleConfig.language,
  country: defaultLocaleConfig.country,
  locale: `${defaultLocaleConfig.language}-${defaultLocaleConfig.country}`,
  setLanguage: defaultSetLanguage,
  setCountry: defaultSetCountry,
  countries: availableCountries,
  currentCountry: globalCountryInfo,
  changeLocale: defaultChangeLocale,
  setLocale: defaultSetLocale,
});

// Translation provider props
interface TranslationProviderProps {
  children: ReactNode;
  currentLocale: CountryLanguage;
}

const noopSubscribe = (): (() => void) => () => undefined;
const routeLocaleSchema = z.enum(CountryLanguageValues);

// false during SSR + hydration, true on the client afterwards
function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

// Translation provider component
export function TranslationProvider({
  children,
  currentLocale,
}: TranslationProviderProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsMounted();
  const logger = useLogger();

  // The root loader can be reused during navigation. Prefer the active route.
  const routeLocale =
    routeLocaleSchema.safeParse(pathname?.split("/")[1]).data ?? currentLocale;
  const { language, country } = getLanguageAndCountryFromLocale(routeLocale);

  // Find the current country info
  const currentCountry =
    availableCountries.find((c) => c.code === country) ||
    availableCountries.find((c) => c.code === Countries.GLOBAL) ||
    globalCountryInfo;

  // Swap the locale segment of the current path. Browser bundles only load
  // the page language's translations (client-locale-loader), so a language
  // change is a full navigation; a country-only change stays client-side.
  const navigateToLocale = (newLocale: string): void => {
    if (!pathname) {
      return;
    }
    const pathSegments = pathname.split("/");
    if (pathSegments.length > 1 && pathSegments[1]) {
      const currentLocaleInPath = pathSegments[1];
      const newPath = pathname.replace(
        `/${currentLocaleInPath}`,
        `/${newLocale}`,
      ) as Route<RouteType>;
      if (newLocale.split("-")[0] !== language) {
        assignUrl(newPath);
        return;
      }
      router.push(newPath);
    }
  };

  // Custom setLanguage that also updates the URL and cookies
  const setLanguage = async (lang: Languages): Promise<void> => {
    if (!mounted) {
      return;
    }

    const newLocale = `${lang}-${country}`;

    // Save to storage
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale, logger);
    await setCookie(LOCALE_COOKIE_NAME, newLocale, logger);

    // Update URL to reflect language change
    navigateToLocale(newLocale);
  };

  // Custom setCountry that also updates localStorage and cookies
  const setCountry = async (newCountry: Countries): Promise<void> => {
    if (!mounted) {
      return;
    }

    const newLocale = `${language}-${newCountry}`;

    // Save to storage
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale, logger);
    await setCookie(LOCALE_COOKIE_NAME, newLocale, logger);

    // Update URL to reflect country change
    navigateToLocale(newLocale);
  };

  // Function to change both country and language at once
  const changeLocale = async (
    newCountry: Countries,
    preferredLanguage: Languages = language,
  ): Promise<void> => {
    if (!mounted) {
      return;
    }

    const countryInfo = languageConfig.countryInfo[newCountry];
    const newLocale = `${languageForCountry(countryInfo, preferredLanguage)}-${newCountry}`;

    // Save to storage (single write, no intermediate states)
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale, logger);
    await setCookie(LOCALE_COOKIE_NAME, newLocale, logger);

    // Single navigation - replace the locale segment in the path
    navigateToLocale(newLocale);
  };

  // Exact language + region pair, one storage write, one navigation
  const setLocale = async (newLocale: CountryLanguage): Promise<void> => {
    if (!mounted) {
      return;
    }
    await storage.setItem(LOCALE_COOKIE_NAME, newLocale, logger);
    await setCookie(LOCALE_COOKIE_NAME, newLocale, logger);
    navigateToLocale(newLocale);
  };

  useEffect(() => {
    setDocumentLang(routeLocale, "ltr");
  }, [routeLocale]);

  // Seed the saved preference when there isn't one.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    async function initializeLocale(): Promise<void> {
      // Only save to localStorage if no preference exists (respect existing localStorage)
      const savedLocale = await storage.getItem(LOCALE_COOKIE_NAME, logger);
      if (!savedLocale && routeLocale) {
        await storage.setItem(LOCALE_COOKIE_NAME, routeLocale, logger);
        await setCookie(LOCALE_COOKIE_NAME, routeLocale, logger);
      }
    }
    void initializeLocale();
  }, [routeLocale, logger]);

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
        setLocale,
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
    // eslint-disable-next-line restricted/restricted-syntax -- Critical initialization error: Context must exist for i18n to function
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return context;
}
