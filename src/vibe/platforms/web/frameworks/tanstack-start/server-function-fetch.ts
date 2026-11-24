import { getVisibilityState } from "next-vibe/ui/lib/dom";
import { getCurrentPathname } from "next-vibe/ui/lib/location";
import { isOnline } from "next-vibe/ui/lib/media";

import { REQUEST_ID_HEADER_NAME } from "@/env/constants";

import {
  CountryLanguageValues,
  defaultLocale,
} from "../../../../core/i18n/core/config";
import { isBrowserNetworkLossMessage } from "../../../../core/utils/parse-error";
import { createClientLogger } from "../../../../logger/client";
import { sanitizeRoutePath } from "../../../../logger/client-context";
import { mintRequestId } from "../../../../logger/with-log-context";

/** Transport for TanStack's browser RPCs. A GET loader can survive one lost connection. */
export async function fetchServerFunction(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  const request = input instanceof Request ? input : undefined;
  const method = (init?.method ?? request?.method ?? "GET").toUpperCase();
  const signal = init?.signal ?? request?.signal;
  for (let attempt = 1; ; attempt++) {
    const requestId = mintRequestId();
    const headers = new Headers(init?.headers ?? request?.headers);
    headers.set(REQUEST_ID_HEADER_NAME, requestId);
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- TanStack Start browser RPC transport
      return await globalThis.fetch(input, { ...init, headers });
    } catch (error) {
      if (
        !(error instanceof TypeError) ||
        !isBrowserNetworkLossMessage(error.message) ||
        signal?.aborted
      ) {
        return Promise.reject(error);
      }
      const retrying = method === "GET" && attempt === 1;
      const url = new URL(request?.url ?? String(input), "http://localhost");
      const localeSegment = getCurrentPathname().split("/")[1];
      const locale =
        Object.values(CountryLanguageValues).find(
          (value) => value === localeSegment,
        ) ?? defaultLocale;
      createClientLogger(false, locale).error(
        "[TanStack] Server function request lost connection",
        error,
        {
          method,
          path: sanitizeRoutePath(url.pathname),
          requestId,
          attempt,
          retrying,
          online: isOnline(),
          visibility: getVisibilityState(),
        },
      );
      if (!retrying) {
        return Promise.reject(error);
      }
    }
  }
}
