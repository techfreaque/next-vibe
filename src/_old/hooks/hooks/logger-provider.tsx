"use client";

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { createClientLogger } from "next-vibe/logger/client";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getSessionItem, setSessionItem } from "next-vibe/ui/lib/storage";
import {
  type Context,
  createContext,
  type JSX,
  type ReactNode,
  useMemo,
} from "react";

declare global {
  var __vibeLoggerContext: Context<EndpointLogger | null> | undefined;
}

// HMR-stable context: this module has mixed exports (component + context), so
// React Fast Refresh cannot hot-swap it in place — a dev-time re-evaluation
// (or a duplicate module instance) would mint a fresh context object while the
// mounted <LoggerContext.Provider> still holds the old one, making every
// useLogger() below it throw. Anchoring the object on globalThis keeps one
// identity across re-evaluations.
export const LoggerContext: Context<EndpointLogger | null> =
  (globalThis.__vibeLoggerContext ??= createContext<EndpointLogger | null>(
    null,
  ));

/** Stable per-tab ID stored in sessionStorage - new tab = new ID, refresh = same ID */
function getOrCreateTabId(): string {
  try {
    const existing = getSessionItem("vibe-tab-id");
    if (existing) {
      return existing;
    }
    const id = crypto.randomUUID();
    setSessionItem("vibe-tab-id", id);
    return id;
  } catch {
    // SSR or storage unavailable - use a one-off ID (won't persist but won't crash)
    return crypto.randomUUID();
  }
}

export function LoggerProvider({
  locale,
  availability,
  children,
}: {
  locale: CountryLanguage;
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  const logger = useMemo(() => {
    // The WS client no longer takes a global logger — it threads an EndpointLogger
    // per subscribe/preWarm call (see websocket/client.ts), so nothing to set here.
    return createClientLogger(false, locale, availability, getOrCreateTabId());
    // locale changes are rare but must re-create so API calls use correct path
  }, [locale, availability]);

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
}
