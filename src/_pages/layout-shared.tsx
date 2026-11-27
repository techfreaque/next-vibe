/**
 * Shared Root Layout Logic
 * Platform-agnostic providers and setup used by both web and native layouts
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { TranslationProvider } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { TabIdentitySync } from "next-vibe/identity/auth/tab-identity-sync";
import { ErrorBoundary } from "next-vibe/ui/components/error-boundary";
import {
  type ThemePreference,
  ThemeProvider,
} from "next-vibe/ui/components/theme-provider";
import { Toaster } from "next-vibe/ui/components/toaster";
import { LoggerProvider } from "next-vibe/ui/hooks/logger-provider";
import { QueryProvider } from "next-vibe/unified-ui/hooks/query-provider";
import type { JSX, ReactNode } from "react";

import { WebVitalsProvider } from "@/analytics/web-vitals/reporter-provider";

import { LeadTrackingProvider } from "./_components/lead-tracking-provider";
import { RootAgentAvailability } from "./_components/root-agent-availability";

export function RootProviders({
  locale,
  theme,
  availability,
  children,
}: {
  locale: CountryLanguage;
  theme?: ThemePreference;
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  return (
    <QueryProvider isolateServerRender>
      {/* Logger outermost (after the query cache): the theme cookie/storage
          sync needs it to report storage failures. */}
      <LoggerProvider locale={locale}>
        <ThemeProvider
          attribute="class"
          defaultTheme={theme ?? "dark"}
          enableSystem={true}
        >
          <TranslationProvider currentLocale={locale}>
            <RootAgentAvailability availability={availability}>
              <ErrorBoundary locale={locale}>{children}</ErrorBoundary>
              <LeadTrackingProvider />
              <WebVitalsProvider locale={locale} />
              <TabIdentitySync />
              <Toaster />
            </RootAgentAvailability>
          </TranslationProvider>
        </ThemeProvider>
      </LoggerProvider>
    </QueryProvider>
  );
}
