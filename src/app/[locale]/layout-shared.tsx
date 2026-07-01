/**
 * Shared Root Layout Logic
 * Platform-agnostic providers and setup used by both web and native layouts
 */

import { TranslationProvider } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { QueryProvider } from "next-vibe/platforms/react/hooks/query-provider";
import { ErrorBoundary } from "next-vibe/ui/web/ui/error-boundary";
import { ThemeProvider } from "next-vibe/ui/web/ui/theme-provider";
import { Toaster } from "next-vibe/ui/web/ui/toaster";
import type { JSX, ReactNode } from "react";

import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { AgentAvailabilityProvider } from "@/app/api/[locale]/agent/env-availability-context";
import { LoggerProvider } from "@/hooks/logger-provider";

import { LeadTrackingProvider } from "./_components/lead-tracking-provider";

export function RootProviders({
  locale,
  theme,
  availability,
  children,
}: {
  locale: CountryLanguage;
  theme?: "light" | "dark";
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme ?? "dark"}
        enableSystem={false}
      >
        <TranslationProvider currentLocale={locale}>
          <LoggerProvider locale={locale} availability={availability}>
            <AgentAvailabilityProvider availability={availability}>
              <ErrorBoundary locale={locale}>{children}</ErrorBoundary>
              <LeadTrackingProvider />
              <Toaster />
            </AgentAvailabilityProvider>
          </LoggerProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
