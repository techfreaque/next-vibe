/**
 * Finance HTTP port
 *
 * Every external provider call goes through this one function so tests inject
 * a mock and NEVER touch a live API. Real calls are read-only GET / POST-for-
 * balance-lookup against our own accounts. Keys travel only in headers and are
 * never logged.
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
}

export interface HttpResult {
  status: number;
  json: JsonValue;
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
    signal: AbortSignal.timeout(FINANCE_CONFIG.requestTimeoutMs),
  });
  const json: JsonValue = await response.json().catch((): JsonValue => null);
  return { status: response.status, json };
};
