"use client";

import { setDomGuardReporter } from "next-vibe/ui/lib/dom-mutation-guard";
import { getSessionItem, setSessionItem } from "next-vibe/ui/lib/storage";
import {
  type Context,
  createContext,
  type JSX,
  type ReactNode,
  useEffect,
  useMemo,
} from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { createClientLogger } from "../../../logger/client";
import { installGlobalErrorListeners } from "../../../logger/global-error-listeners";
import type { EndpointLogger } from "../../../logger/types";

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
function getOrCreateTabId(logger: EndpointLogger): string {
  try {
    const existing = getSessionItem("vibe-tab-id", logger);
    if (existing) {
      return existing;
    }
    const id = crypto.randomUUID();
    setSessionItem("vibe-tab-id", id, logger);
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
    // The WS client no longer takes a global logger — it threads an EndpointLogger
    // per subscribe/preWarm call (see websocket/client.ts), so nothing to set here.
    // Bootstrap logger (no tab id yet) so a sessionStorage failure while
    // reading the tab id is still reported.
    const bootstrapLogger = createClientLogger(false, locale);
    return createClientLogger(false, locale, getOrCreateTabId(bootstrapLogger));
    // locale changes are rare but must re-create so API calls use correct path
  }, [locale]);

  // window "error" / "unhandledrejection" / CSP violations -> error log.
  // Idempotent: a re-render or locale change only swaps the reporting logger.
  useEffect(() => {
    installGlobalErrorListeners(logger);
  }, [logger]);

  // Surface every DOM mutation the translator/extension guard had to tolerate
  // (see dom-mutation-guard.ts) - those used to crash React with
  // "Failed to execute 'insertBefore' on 'Node'".
  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }
    return setDomGuardReporter((event, hints) => {
      logger.warn(
        `[dom-guard] Foreign DOM mutation tolerated: ${event.operation} (${event.resolution})`,
        { ...event, ...hints, pageLocale: locale },
      );
    });
  }, [logger, locale]);

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
}
