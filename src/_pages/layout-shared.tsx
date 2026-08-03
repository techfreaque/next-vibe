/**
 * Shared Root Layout Logic
 * Platform-agnostic providers and setup used by both web and native layouts
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { AgentAvailabilityProvider } from "next-vibe/agent/env-availability-store";
import { TranslationProvider } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { LoggerProvider } from "next-vibe/ui/hooks/logger-provider";
import { ErrorBoundary } from "next-vibe/ui/ui/error-boundary";
import { ThemeProvider } from "next-vibe/ui/ui/theme-provider";
import { Toaster } from "next-vibe/ui/ui/toaster";
import { QueryProvider } from "next-vibe/unified-ui/hooks/query-provider";
import type { JSX, ReactNode } from "react";

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
          <LoggerProvider locale={locale}>
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
