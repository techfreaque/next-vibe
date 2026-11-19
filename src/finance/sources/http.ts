/**
 * Finance HTTP port
 *
 * Every external provider call goes through this one function so tests inject
 * a mock. Live calls authenticate or read balances and usage for our accounts.
 * Private API keys and session tokens travel in headers and are never logged.
 */

import "server-only";

import { FINANCE_CONFIG } from "../config";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface HttpRequest {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  /** JSON body (POST) */
  body?: JsonValue;
  rejectRedirects?: boolean;
}

export interface HttpResult {
  status: number;
  json: JsonValue;
  retryAfterMs?: number;
}

export type FinanceHttp = (request: HttpRequest) => Promise<HttpResult>;

/** Live implementation. Network errors surface as a rejected promise; callers catch per source. */
export const liveHttp: FinanceHttp = async (request) => {
  // Third-party provider API (our own account), not an own-endpoint call.
  // oxlint-disable-next-line restricted/no-raw-fetch
  const response = await fetch(request.url, {
    method: request.method,
    headers:
      request.body === undefined
        ? request.headers
        : { "Content-Type": "application/json", ...request.headers },
    body: request.body === undefined ? undefined : JSON.stringify(request.body),
    redirect: request.rejectRedirects ? "error" : "follow",
    signal: AbortSignal.timeout(FINANCE_CONFIG.requestTimeoutMs),
  });
  const json: JsonValue = await response.json().catch((): JsonValue => null);
  const retryAfter = response.headers.get("Retry-After");
  const retryAfterMs =
    retryAfter === null
      ? undefined
      : /^\d+$/.test(retryAfter)
        ? Number(retryAfter) * 1_000
        : Date.parse(retryAfter) - Date.now();
  return {
    status: response.status,
    json,
    ...(retryAfterMs !== undefined && Number.isFinite(retryAfterMs)
      ? { retryAfterMs }
      : {}),
  };
};
