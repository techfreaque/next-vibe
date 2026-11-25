import "server-only";

/**
 * IndexNow key reachability: the search engines fetch `<host>/<key>.txt` and
 * reject the whole submission unless it answers 200 with the key as body.
 * Checked before every submission so a redirect or missing file skips the
 * ping instead of burning a rejected batch.
 */
import { parseError } from "next-vibe/core/utils/parse-error";

import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_CHECK_TIMEOUT_MS,
  INDEXNOW_KEY_PATH,
} from "./constants";

export interface IndexNowKeyCheck {
  ok: boolean;
  keyUrl: string;
  /** HTTP status, null when the request itself failed. */
  status: number | null;
  /** Redirect target (Location header) when the key URL redirects. */
  location: string | null;
  /** URL that produced the response (redirects are not followed). */
  finalUrl: string;
  contentType: string | null;
  /** First bytes of the body, or the network error message. */
  body: string;
}

export function indexNowKeyUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${INDEXNOW_KEY_PATH}`;
}

export async function checkIndexNowKey(
  baseUrl: string,
): Promise<IndexNowKeyCheck> {
  const keyUrl = indexNowKeyUrl(baseUrl);
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(keyUrl, {
      method: "GET",
      // A redirect fails verification at the search engines too: never follow.
      redirect: "manual",
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(INDEXNOW_KEY_CHECK_TIMEOUT_MS),
    });
    const body = (await response.text()).slice(0, 200);
    return {
      ok: response.status === 200 && body.trim() === INDEXNOW_KEY,
      keyUrl,
      status: response.status,
      location: response.headers.get("location"),
      finalUrl: response.url || keyUrl,
      contentType: response.headers.get("content-type"),
      body,
    };
  } catch (error) {
    return {
      ok: false,
      keyUrl,
      status: null,
      location: null,
      finalUrl: keyUrl,
      contentType: null,
      body: parseError(error).message,
    };
  }
}
