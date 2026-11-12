/**
 * Client Error Log Repository
 * Receives client-side error reports and persists them via the same error-persist mechanism.
 */

import "server-only";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import { persistErrorLog } from "../../db-persist";
import { isFileLoggingEnabled } from "../../debug";
import { clientFileLog } from "../../file";
import {
  CLIENT_LOG_FINGERPRINT_IGNORE_KEYS,
  CLIENT_LOG_OCCURRENCES_KEY,
} from "./constants";
import type {
  ClientLogRequestOutput,
  ClientLogResponseOutput,
} from "./definition";

function extractTabId(
  metadata: ClientLogRequestOutput["metadata"],
): string | undefined {
  if (!metadata) {
    return undefined;
  }
  for (const m of metadata) {
    if (
      m !== null &&
      m !== undefined &&
      typeof m === "object" &&
      !Array.isArray(m) &&
      !(m instanceof Date) &&
      "tabId" in m &&
      typeof m["tabId"] === "string"
    ) {
      return m["tabId"];
    }
  }
  return undefined;
}

/** First string value of `key` across the metadata records. */
function findString(
  metadata: ClientLogRequestOutput["metadata"],
  key: string,
): string | undefined {
  for (const m of metadata ?? []) {
    if (
      m !== null &&
      typeof m === "object" &&
      !Array.isArray(m) &&
      !(m instanceof Date) &&
      key in m
    ) {
      const v = m[key];
      if (typeof v === "string" && v.length > 0) {
        return v;
      }
    }
  }
  return undefined;
}

/** Deduplicated occurrence count flushed by the client logger (default 1). */
function findOccurrences(
  metadata: ClientLogRequestOutput["metadata"],
): number | undefined {
  for (const m of metadata ?? []) {
    if (
      m !== null &&
      typeof m === "object" &&
      !Array.isArray(m) &&
      !(m instanceof Date) &&
      CLIENT_LOG_OCCURRENCES_KEY in m
    ) {
      const v = m[CLIENT_LOG_OCCURRENCES_KEY];
      if (typeof v === "number" && Number.isInteger(v) && v > 0) {
        // Bounded: a client can't inflate a row arbitrarily
        return Math.min(v, 10_000);
      }
    }
  }
  return undefined;
}

export class ClientLogRepository {
  static async log(
    data: ClientLogRequestOutput,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): Promise<ResponseType<ClientLogResponseOutput>> {
    const message = `[client] ${data.message}`;
    // Who hit it, from the verified JWT - ids and roles only, never PII.
    const metadata = [
      ...(data.metadata ?? []),
      {
        userId: user.isPublic ? null : user.id,
        leadId: user.leadId,
        isPublic: user.isPublic,
        userRoles: (user.roles ?? []).join(","),
      },
    ];

    // DB gets locale in metadata, file does not
    persistErrorLog(data.level, message, undefined, metadata, locale, {
      occurrences: findOccurrences(data.metadata),
      // The browser's stack/class name - fills error_logs.stack_trace/error_type
      stackTrace:
        findString(data.metadata, "errorStack") ??
        findString(data.metadata, "componentStack"),
      errorType: findString(data.metadata, "errorName"),
      fingerprintIgnoreKeys: CLIENT_LOG_FINGERPRINT_IGNORE_KEYS,
    });

    if (isFileLoggingEnabled()) {
      const tabId = extractTabId(data.metadata);
      if (tabId) {
        const metaObj = metadata.length > 0 ? { metadata } : undefined;
        void clientFileLog(tabId, message, metaObj);
      }
    }

    return success({ ok: true });
  }
}
