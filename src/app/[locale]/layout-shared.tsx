/**
 * Shared Root Layout Logic
 * Platform-agnostic providers and setup used by both web and native layouts
 */

import { ThemeProvider } from "next-vibe-ui/ui/theme-provider";
import { Toaster } from "next-vibe-ui/ui/toaster";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { TranslationProvider } from "@/i18n/core/client";

import { ErrorBoundary } from "./_components/error-boundary";
import ErrorFallback from "./_components/error-fallback";
import { LeadTrackingProvider } from "./_components/lead-tracking-provider";
import { QueryProvider } from "next-vibe/system/unified-interface/react/hooks/query-provider";
/**
 * Shared root providers for both web and native
 * Contains all platform-agnostic provider logic
 */
export function RootProviders({
  locale,
  children,
}: {
  locale: CountryLanguage;
  children: ReactNode;
}): JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TranslationProvider currentLocale={locale}>
          <LeadTrackingProvider />
          <ErrorBoundary fallback={<ErrorFallback />} locale={locale}>
            {children}
          </ErrorBoundary>
          <Toaster />
        </TranslationProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
