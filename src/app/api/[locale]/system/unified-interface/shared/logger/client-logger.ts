/**
 * Client-side Logger
 * Thin wrapper around logger-core that POSTs errors/warnings to the server for DB persistence.
 * Import this in all client code: "use client" components, client hooks, etc.
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger, LoggerMetadata } from "./endpoint";
import { createLogger } from "./logger-core";
import { CLIENT_LOG_PATH } from "../../tasks/error-monitor/client-log/constants";

function reportToServer(
  level: "error" | "warn",
  message: string,
  error: LoggerMetadata | undefined,
  metadata: LoggerMetadata[],
  locale: CountryLanguage,
  tabId: string | undefined,
): void {
  const allMeta = error !== undefined ? [error, ...metadata] : metadata;
  const metaPayload = allMeta
    .filter(
      (m): m is Record<string, LoggerMetadata> =>
        typeof m === "object" &&
        m !== null &&
        !(m instanceof Error) &&
        !(m instanceof Date) &&
        !Array.isArray(m),
    )
    .map((m) => m as Record<string, LoggerMetadata>);

  // Append tab identity so server-side logs are traceable per browser tab
  const tabMeta: Record<string, LoggerMetadata> | undefined = tabId
    ? { tabId }
    : undefined;
  const fullMeta = tabMeta ? [...metaPayload, tabMeta] : metaPayload;

  void fetch(`/api/${locale}/${CLIENT_LOG_PATH.join("/")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      level,
      message: message.slice(0, 500),
      metadata: fullMeta.length > 0 ? fullMeta : undefined,
    }),
    keepalive: true,
  }).catch(() => {
    // silently swallow — client logger must never cascade
  });
}

export function createClientLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
  tabId?: string,
): EndpointLogger {
  return createLogger(
    debugEnabled,
    startTime,
    locale,
    (level, message, error, metadata) => {
      reportToServer(level, message, error, metadata, locale, tabId);
    },
  );
}
