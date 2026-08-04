/**
 * Client Error Log Repository
 * Receives client-side error reports and persists them via the same error-persist mechanism.
 */

import "server-only";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import { persistErrorLog } from "../../db-persist";
import { isFileLoggingEnabled } from "../../debug";
import { clientFileLog } from "../../file";
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

export class ClientLogRepository {
  static async log(
    data: ClientLogRequestOutput,
    locale: CountryLanguage,
  ): Promise<ResponseType<ClientLogResponseOutput>> {
    const message = `[client] ${data.message}`;
    const metadata = data.metadata ?? [];

    // DB gets locale in metadata, file does not
    persistErrorLog(data.level, message, undefined, metadata, locale);

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
