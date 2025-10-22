import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import { TranslationProvider } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface LocaleLayoutProps {
  children?: ReactNode;
}

/**
 * Locale Layout
 * Works for both Next.js and Expo Router
 * Uses Next.js naming convention: layout.tsx
 */
export default function LocaleLayout({
  children,
}: LocaleLayoutProps): React.ReactElement {
  const { locale } = useLocalSearchParams<{ locale: string }>();
  const countryLanguage = (locale || "en-GLOBAL") as CountryLanguage;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {/* <TranslationProvider currentLocale={countryLanguage}> */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        {children}
      </Stack>
      {/* </TranslationProvider> */}
    </SafeAreaProvider>
  );
}
