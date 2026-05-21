/**
 * Corvina HTTP Client
 *
 * Thin wrapper around fetch that injects the cached service-account token,
 * resolves paths against CORVINA_API_BASE_URL, and maps HTTP status codes
 * to the platform's ResponseType / ErrorResponseTypes contract so callers
 * never have to hand-roll error mapping.
 *
 * The shape of every Corvina response is unverified - the OpenAPI spec
 * has not been captured yet - so callers parse the body with a Zod schema
 * passed in via `parse`. That keeps the contract explicit at the call site.
 */

import "server-only";

import type { ZodType } from "zod";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { CorvinaAuth } from "./auth";
import { corvinaEnv } from "./env";

const REQUEST_TIMEOUT_MS = 20_000;

export interface CorvinaRequestInit<TResponse> {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  parse: ZodType<TResponse>;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class CorvinaClient {
  static async request<TResponse>(
    init: CorvinaRequestInit<TResponse>,
    logger: EndpointLogger,
  ): Promise<ResponseType<TResponse>> {
    const tokenResult = await CorvinaAuth.getAccessToken(logger);
    if (!tokenResult.success) {
      return tokenResult;
    }

    const url = this.buildUrl(init.path, init.query);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${tokenResult.data}`,
      Accept: "application/json",
    };
    let body: BodyInit | undefined;
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(init.body);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: init.method,
        headers,
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      logger.error("[CORVINA_CLIENT] Network error", {
        method: init.method,
        url,
        error: String(error),
      });
      return fail({
        message: "Could not reach the Corvina API.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (response.status === 401) {
      CorvinaAuth.invalidate();
      const retryToken = await CorvinaAuth.getAccessToken(logger);
      if (!retryToken.success) {
        return retryToken;
      }
      try {
        response = await fetch(url, {
          method: init.method,
          headers: {
            ...headers,
            Authorization: `Bearer ${retryToken.data}`,
          },
          body,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
      } catch (error) {
        logger.error("[CORVINA_CLIENT] Network error on retry", {
          method: init.method,
          url,
          error: String(error),
        });
        return fail({
          message: "Could not reach the Corvina API.",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.error("[CORVINA_CLIENT] Non-OK response", {
        method: init.method,
        url,
        status: response.status,
        body: text.slice(0, 1000),
      });
      return this.mapStatusToFailure(response.status, text);
    }

    if (response.status === 204) {
      const parsed = init.parse.safeParse(undefined);
      if (!parsed.success) {
        logger.error("[CORVINA_CLIENT] 204 not parseable", {
          method: init.method,
          url,
        });
        return fail({
          message: "Corvina API returned 204 but a response body was expected.",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success(parsed.data);
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch (error) {
      logger.error("[CORVINA_CLIENT] JSON parse error", {
        method: init.method,
        url,
        error: String(error),
      });
      return fail({
        message: "Corvina API returned an unparseable response.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const parsed = init.parse.safeParse(raw);
    if (!parsed.success) {
      logger.error("[CORVINA_CLIENT] Schema mismatch", {
        method: init.method,
        url,
        issues: parsed.error.issues.slice(0, 5),
      });
      return fail({
        message:
          "Corvina API response did not match the expected schema. The path may need adjustment.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return success(parsed.data);
  }

  private static buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = corvinaEnv.CORVINA_API_BASE_URL.replace(/\/$/, "");
    const suffix = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${base}${suffix}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  private static mapStatusToFailure(
    status: number,
    body: string,
  ): ResponseType<never> {
    const snippet = body.slice(0, 200);
    if (status === 400) {
      return fail({
        message: snippet || "Corvina rejected the request as invalid.",
        errorType: ErrorResponseTypes.VALIDATION_FAILED,
      });
    }
    if (status === 401) {
      return fail({
        message:
          "Corvina returned 401 even after refreshing the token. The service account may lack the required scope.",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    if (status === 403) {
      return fail({
        message:
          "Corvina denied the request. The service account does not have the required scope for this resource.",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    if (status === 404) {
      return fail({
        message: "Corvina resource not found.",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (status === 409) {
      return fail({
        message: snippet || "Corvina reports a conflict for this request.",
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    if (status >= 500) {
      return fail({
        message: `Corvina API server error (${status}).`,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return fail({
      message: `Unexpected Corvina API status (${status}).`,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
