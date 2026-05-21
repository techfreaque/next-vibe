import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { corvinaEnv } from "./env";

export const CORVINA_ORGS_PATH = "/api/v1/organizations";
export const CORVINA_PLATFORM_ORGS_PATH = "/api/v1/organizations";

const REQUEST_TIMEOUT_MS = 20_000;

type CorvinaBodyValue =
  | string
  | number
  | boolean
  | null
  | CorvinaBodyObject
  | CorvinaBodyValue[];
interface CorvinaBodyObject {
  [key: string]: CorvinaBodyValue;
}

export interface CorvinaRequestInit<
  TBody extends CorvinaBodyObject = CorvinaBodyObject,
  TQuery extends Record<string, string | number | undefined> = Record<
    string,
    string | number | undefined
  >,
> {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  body?: TBody;
  query?: TQuery;
  usePlatformApi?: boolean;
}

export class CorvinaClient {
  static async request<
    TResponse,
    TBody extends CorvinaBodyObject = CorvinaBodyObject,
    TQuery extends Record<string, string | number | undefined> = Record<
      string,
      string | number | undefined
    >,
  >(
    init: CorvinaRequestInit<TBody, TQuery>,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TResponse>> {
    const { t } = sharedScopedTranslation.scopedT(locale);
    const apiKey = corvinaEnv.CORVINA_API_KEY;

    if (!apiKey) {
      logger.warn("[CORVINA_CLIENT] Missing API key");
      return fail({
        message: t("errorTypes.unauthorized"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const url = this.buildUrl(init.path, init.query, init.usePlatformApi);

    const headers: Record<string, string> = {
      "X-Api-Key": apiKey,
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
        message: t("errorTypes.external_service_error"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.error("[CORVINA_CLIENT] Non-OK response", {
        method: init.method,
        url,
        status: response.status,
        body: text.slice(0, 1000),
      });
      return this.mapStatusToFailure(response.status, t);
    }

    if (response.status === 204) {
      return success(undefined as TResponse);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return success(undefined as TResponse);
    }

    let raw: TResponse;
    try {
      raw = (await response.json()) as TResponse;
    } catch {
      return success(undefined as TResponse);
    }

    return success(raw);
  }

  private static buildUrl<
    TQuery extends Record<string, string | number | undefined>,
  >(path: string, query?: TQuery, usePlatformApi = false): string {
    const rawBase = usePlatformApi
      ? corvinaEnv.CORVINA_PLATFORM_API_BASE_URL
      : corvinaEnv.CORVINA_API_BASE_URL;
    const base = rawBase.replace(/\/$/, "");
    const suffix = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${base}${suffix}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) {
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  private static mapStatusToFailure(
    status: number,
    t: ReturnType<typeof sharedScopedTranslation.scopedT>["t"],
  ): ResponseType<never> {
    if (status === 400) {
      return fail({
        message: t("errorTypes.bad_request"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    if (status === 401) {
      return fail({
        message: t("errorTypes.unauthorized"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    if (status === 403) {
      return fail({
        message: t("errorTypes.forbidden"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    if (status === 404) {
      return fail({
        message: t("errorTypes.not_found"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (status === 409) {
      return fail({
        message: t("errorTypes.bad_request"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    if (status >= 500) {
      return fail({
        message: t("errorTypes.external_service_error"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return fail({
      message: t("errorTypes.unknown_error"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
