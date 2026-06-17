"use client";

import { createContext, type JSX, type ReactNode, useMemo } from "react";

import { createClientLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/client-logger";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { setWsLogger } from "@/app/api/[locale]/system/unified-interface/websocket/client";
import type { CountryLanguage } from "@/i18n/core/config";

export const LoggerContext = createContext<EndpointLogger | null>(null);

/** Stable per-tab ID stored in sessionStorage - new tab = new ID, refresh = same ID */
function getOrCreateTabId(): string {
  try {
    const existing = sessionStorage.getItem("vibe-tab-id");
    if (existing) {
      return existing;
    }
    const id = crypto.randomUUID();
    sessionStorage.setItem("vibe-tab-id", id);
    return id;
  } catch {
    // SSR or storage unavailable - use a one-off ID (won't persist but won't crash)
    return crypto.randomUUID();
  }
}

export function LoggerProvider({
  locale,
  children,
}: {
  locale: CountryLanguage;
  children: ReactNode;
}): JSX.Element {
  const logger = useMemo(() => {
    const l = createClientLogger(false, Date.now(), locale, getOrCreateTabId());
    setWsLogger(l);
    return l;
    // locale changes are rare but must re-create so API calls use correct path
  }, [locale]);

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
}
