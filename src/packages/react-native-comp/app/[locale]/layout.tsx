import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { JSX, ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TranslationProvider } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface LocaleLayoutProps {
  children?: ReactNode;
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * Locale Layout
 * Works for both Next.js and Expo Router
 * Uses Next.js naming convention: layout.tsx
 */
export default async function LocaleLayout({
  params,
  children,
}: LocaleLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <TranslationProvider currentLocale={locale}>
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
      </TranslationProvider>
    </SafeAreaProvider>
  );
}
