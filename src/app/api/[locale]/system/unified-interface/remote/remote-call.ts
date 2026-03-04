/**
 * Remote Call
 *
 * Pure HTTP execution primitive for calling endpoints on a remote instance.
 * Stateless — no session file access, no singletons.
 * Caller is responsible for providing token, leadId, and remoteUrl.
 *
 * Used by:
 * - CLI: reads token from .vibe.remote.session
 * - Memory repository: reads token from remote-session-cache
 * - AI stream tools (future): reads token from user's configured remote login
 */

/* eslint-disable i18next/no-literal-string */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import { Methods } from "../shared/types/enums";

/** Data shape for remote calls — matches the serialisable subset used by endpoints */
export type RemoteCallData = Record<
  string,
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[]
  | Record<string, string | number | boolean | null>
>;

export interface RemoteCallParams {
  definition: CreateApiEndpointAny;
  data: RemoteCallData;
  urlPathParams?: RemoteCallData;
  /** Raw JWT token — sourced by caller (session file, user config, etc.) */
  token: string;
  leadId?: string;
  remoteUrl: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

/**
 * Build the HTTP URL for a remote call.
 * - Replaces [param] segments in path with values from urlPathParams
 * - GET requests embed data as query params
 * - POST/PATCH/DELETE return base URL (body sent separately)
 */
export function buildRemoteUrl(
  remoteUrl: string,
  locale: CountryLanguage,
  definition: CreateApiEndpointAny,
  data: RemoteCallData,
  urlPathParams?: RemoteCallData,
): string {
  const resolvedPath = definition.path
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const key = segment.slice(1, -1);
        const value = urlPathParams?.[key];
        return value !== undefined ? String(value) : segment;
      }
      return segment;
    })
    .join("/");

  if (definition.method === Methods.GET) {
    const url = new URL(`/api/${locale}/${resolvedPath}`, remoteUrl);
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  return `${remoteUrl}/api/${locale}/${resolvedPath}`;
}

/**
 * Build Authorization + Cookie headers from token and optional leadId.
 */
export function buildRemoteHeaders(
  token: string,
  leadId?: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (leadId) {
    headers.Cookie = `${LEAD_ID_COOKIE_NAME}=${leadId}`;
  }

  return headers;
}

interface RemoteResponseShape {
  success: boolean;
  data?: RemoteCallData;
  message?: string;
  errorType?: string;
  messageParams?: Record<string, string>;
}

/**
 * Execute an endpoint on a remote host via HTTP.
 * Returns ResponseType<T> — never throws.
 */
export async function executeRemote<T>(
  params: RemoteCallParams,
): Promise<ResponseType<T>> {
  const {
    definition,
    data,
    urlPathParams,
    token,
    leadId,
    remoteUrl,
    locale,
    logger,
  } = params;

  const url = buildRemoteUrl(
    remoteUrl,
    locale,
    definition,
    data,
    urlPathParams,
  );
  const headers = buildRemoteHeaders(token, leadId);

  logger.debug(`[REMOTE] ${definition.method} ${url}`);

  try {
    const response = await fetch(url, {
      method: definition.method,
      headers,
      body:
        definition.method === Methods.GET ? undefined : JSON.stringify(data),
      redirect: "manual",
    });

    const { t } = sharedScopedTranslation.scopedT(locale);
    try {
      const json = (await response.json()) as RemoteResponseShape;

      if (!json.success) {
        return fail({
          message:
            (json.message as Parameters<typeof fail>[0]["message"]) ??
            t("errorTypes.internal_error"),
          errorType: json.errorType
            ? (ErrorResponseTypes[
                json.errorType as keyof typeof ErrorResponseTypes
              ] ?? ErrorResponseTypes.INTERNAL_ERROR)
            : ErrorResponseTypes.INTERNAL_ERROR,
          ...(json.messageParams && { messageParams: json.messageParams }),
        });
      }

      return success(json.data as T);
    } catch {
      logger.error(`[REMOTE] Failed to parse response JSON from ${url}`);
      return fail({
        message: t("errorTypes.internal_error"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  } catch (error) {
    logger.error(`[REMOTE] Fetch failed: ${parseError(error).message}`);
    const { t } = sharedScopedTranslation.scopedT(defaultLocale);
    return fail({
      message: t("errorTypes.internal_error"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Fire-and-forget remote call — returns void immediately, logs failures.
 * Never throws. Do NOT await this.
 */
export function fireAndForgetRemote(params: RemoteCallParams): void {
  void executeRemote(params).then((result) => {
    if (!result.success) {
      params.logger.warn(
        `[REMOTE] Fire-and-forget failed: ${params.definition.path.join("/")} — ${result.message}`,
      );
    }
    return result;
  });
}
