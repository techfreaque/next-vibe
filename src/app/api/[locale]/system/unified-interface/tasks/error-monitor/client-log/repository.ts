/**
 * Client Error Log Repository
 * Receives client-side error reports and persists them via the same error-persist mechanism.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { persistErrorLog } from "@/app/api/[locale]/system/unified-interface/shared/logger/error-persist";
import { clientFileLog } from "@/app/api/[locale]/system/unified-interface/shared/logger/file-logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { isFileLoggingEnabled } from "@/config/debug";

import type {
  ClientLogRequestOutput,
  ClientLogResponseOutput,
} from "./definition";

function extractTabId(
  metadata: Record<string, string>[] | undefined,
): string | undefined {
  if (!metadata) {
    return undefined;
  }
  for (const m of metadata) {
    if (typeof m["tabId"] === "string") {
      return m["tabId"];
    }
  }
  return undefined;
}

export class ClientLogRepository {
  static async log(
    data: ClientLogRequestOutput,
    locale: CountryLanguage,
  ): Promise<ResponseType<ClientLogResponseOutput>> {
    const message = `[client] ${data.message}`;
    const metadata = data.metadata ?? [];

    // DB gets locale in metadata, file does not
    persistErrorLog(data.level, message, undefined, [...metadata, { locale }]);

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
