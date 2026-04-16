"use client";

import {
  createContext,
  useContext,
  useMemo,
  type JSX,
  type ReactNode,
} from "react";

import { createClientLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/client-logger";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

const LoggerContext = createContext<EndpointLogger | null>(null);

/** Stable per-tab ID stored in sessionStorage — new tab = new ID, refresh = same ID */
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
    // SSR or storage unavailable — use a one-off ID (won't persist but won't crash)
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
  const logger = useMemo(
    () => createClientLogger(false, Date.now(), locale, getOrCreateTabId()),
    // locale changes are rare but must re-create so API calls use correct path
    [locale],
  );

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
}

export function useLogger(): EndpointLogger {
  const logger = useContext(LoggerContext);
  if (!logger) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useLogger must be used inside LoggerProvider");
  }
  return logger;
}
