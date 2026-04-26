/**
 * Client-side Logger
 * Thin wrapper around logger-core that POSTs errors/warnings to the server for DB persistence.
 * Import this in all client code: "use client" components, client hooks, etc.
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { EndpointLogger, LoggerMetadata } from "./endpoint";
import { createLogger } from "./logger-core";

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

  // Use the typed executeMutation transport — handles CSRF, auth, and response parsing.
  // Import lazily so this file stays tree-shakeable in non-browser bundles.
  void (async (): Promise<void> => {
    try {
      const [{ executeMutation }, { POST }] = await Promise.all([
        import("@/app/api/[locale]/system/unified-interface/react/hooks/mutation-executor"),
        import("@/app/api/[locale]/system/unified-interface/tasks/error-monitor/client-log/definition"),
      ]);

      // Minimal public-user stub — server re-auths from the JWT cookie.
      // The user param here only drives client-side routing decisions.
      const publicUser = {
        isPublic: true as const,
        leadId: "",
        roles: [UserPermissionRole.PUBLIC],
      };

      // Cast metadata to Record<string, string>[] as required by the endpoint schema.
      // Values are already serialised strings at this point.
      const typedMeta =
        fullMeta.length > 0
          ? (fullMeta as Record<string, string>[])
          : undefined;

      await executeMutation({
        endpoint: POST,
        logger: createLogger(false, Date.now(), locale),
        requestData: {
          level,
          message: message.slice(0, 500),
          metadata: typedMeta,
        },
        pathParams: undefined as never,
        locale,
        user: publicUser,
      });
    } catch {
      // silently swallow — client logger must never cascade
    }
  })();
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
