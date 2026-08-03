/**
 * RemoteTransport — connection-bootstrap WIRE primitives.
 *
 * This module owns the raw HTTP that runs BEFORE a `remoteConnections` row
 * exists (ping-for-leadId, remote login/register) or where the raw Response is
 * required (Set-Cookie leadId, status handling). Talking to a peer instance is
 * the remote-connection domain's concern — dispatch routing is ./routing.ts,
 * connection-backed calls are RouteExecuteRepository.runInProcessTyped, and
 * this is the pre-connection escape hatch underneath both.
 */

import "server-only";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { Methods } from "../core/definition/enums";
import type { CountryLanguage } from "../core/i18n/core/config";
import type { ResponseType } from "../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../core/route/response.schema";
import type { WidgetData } from "../core/utils/json";

import { BEARER_LEAD_ID_SEPARATOR, LEAD_ID_COOKIE_NAME } from "@/env/constants";

import type { RemoteCallParams, RemoteCallResult } from "./types";

export class RemoteTransport {
  /**
   * The ONE place that talks raw HTTP to a remote instance. Every authenticated,
   * connection-backed remote call must instead go through
   * RouteExecuteRepository.runInProcessTyped({ instanceId }) — that path resolves
   * the wire leg from the `remoteConnections` row and cannot be used during
   * connection bootstrap (no row exists yet). This method covers exactly those
   * bootstrap cases and the few callers that need the raw Response (Set-Cookie
   * leadId, non-2xx status handling).
   *
   * leadId and token are BOTH optional: a bare leadId ping sends neither auth nor
   * cookie; a pre-login call sends only the lead_id Cookie; an authenticated
   * bootstrap call (register) sends the `Bearer token####leadId` header.
   */
  private static async callRaw(
    params: RemoteCallParams,
  ): Promise<RemoteCallResult> {
    const {
      remoteUrl,
      apiPath,
      method,
      body,
      token,
      leadId,
      redirect = "follow",
      timeoutMs = 30_000,
    } = params;
    const fullUrl = apiPath ? `${remoteUrl}/api/${apiPath}` : remoteUrl;
    const headers: Record<string, string> = {};
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      // Keepalive socket reuse corrupts multi-MB request bodies between Bun's
      // fetch and the peer's HTTP layer (stalls ~12s, "socket closed
      // unexpectedly") — a fresh connection per call makes delivery
      // deterministic. See execute-tool/repository/remote.ts callToolDirect.
      headers["Connection"] = "close";
    }
    if (token !== undefined) {
      // Authenticated call: Bearer carries the lead-id suffix when present, else
      // the bare token (matches the pre-refactor behaviour for tokens without a
      // stored lead-id).
      headers["Authorization"] =
        leadId !== undefined
          ? `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`
          : `Bearer ${token}`;
    } else if (leadId !== undefined) {
      // Pre-login call: no token yet, forward the lead-id cookie obtained from
      // the bootstrap ping so the login request keeps the same lead identity.
      headers["Cookie"] = `${LEAD_ID_COOKIE_NAME}=${leadId}`;
    }
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- the ONE sanctioned remote raw-HTTP primitive; all other remote calls use runInProcessTyped
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        redirect,
        signal: AbortSignal.timeout(timeoutMs),
      });
      const setCookie = response.headers.get("set-cookie") ?? "";
      const match = setCookie.match(
        new RegExp(`${LEAD_ID_COOKIE_NAME}=([^;]+)`),
      );
      let parsed: Record<string, WidgetData> | null = null;
      try {
        parsed = (await response.json()) as Record<string, WidgetData>;
      } catch {
        parsed = null;
      }
      return {
        ok: response.ok,
        status: response.status,
        body: parsed,
        setCookieLeadId: match?.[1] ?? null,
        networkError: false,
      };
    } catch {
      return {
        ok: false,
        status: 0,
        body: null,
        setCookieLeadId: null,
        networkError: true,
      };
    }
  }

  /**
   * Obtain a fresh lead_id from a remote instance. The public API requires a
   * lead_id, so before an unauthenticated call (login) we GET the instance's
   * locale page — middleware sets the lead_id cookie — and read it back from
   * Set-Cookie. Returns undefined if the instance is unreachable or sends none.
   *
   * This is THE single place that acquires a remote lead_id; callers must not
   * re-implement the ping + Set-Cookie parse.
   */
  static async fetchLeadId(remoteUrl: string): Promise<string | undefined> {
    const ping = await RemoteTransport.callRaw({
      remoteUrl,
      method: Methods.GET,
    });
    return ping.setCookieLeadId ?? undefined;
  }

  /**
   * Typed direct call to a specific endpoint on an ALREADY-RESOLVED peer
   * connection — no DB lookup, no execute()/dispatch re-entry. For callers that
   * already hold the connection (remoteUrl + token + leadId) and must not route
   * back through the connection machinery (e.g. the WS connector's own pull,
   * which runs while the connection is being established).
   *
   * Returns `{ response, status, networkError }` so callers that need raw HTTP
   * status for retry/error discrimination can access it alongside the typed
   * ResponseType.
   *
   * Everything that CAN resolve by (user, instanceId) should use
   * RouteExecuteRepository.runInProcessTyped instead — this is the escape hatch
   * for the transport layer itself.
   */
  static async callEndpointDirect<TDef extends CreateApiEndpointAny>(
    params: {
      connection: { remoteUrl: string; token: string; leadId?: string };
      definition: TDef;
      locale: CountryLanguage;
      timeoutMs?: number;
    } & (TDef["types"]["UrlVariablesOutput"] extends never
      ? { urlPathParams?: never }
      : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }) &
      (TDef["types"]["RequestOutput"] extends never
        ? { input?: never }
        : { input: TDef["types"]["RequestOutput"] }),
  ): Promise<{
    response: ResponseType<TDef["types"]["ResponseOutput"]>;
    status: number;
    networkError: boolean;
  }> {
    const { connection, definition, locale, input, timeoutMs } = params;
    const rawUrlPathParams = (
      params as { urlPathParams?: Record<string, string> }
    ).urlPathParams;
    const parsedPathParams = rawUrlPathParams
      ? (definition.requestUrlPathParamsSchema.parse(
          rawUrlPathParams,
        ) as Record<string, string>)
      : undefined;
    const resolvedPath = (definition.path as string[])
      .map((segment) =>
        parsedPathParams && segment.startsWith("[") && segment.endsWith("]")
          ? (parsedPathParams[segment.slice(1, -1)] ?? segment)
          : segment,
      )
      .join("/");
    const raw = await RemoteTransport.callRaw({
      remoteUrl: connection.remoteUrl,
      apiPath: `${locale}/${resolvedPath}`,
      method: definition.method,
      token: connection.token,
      leadId: connection.leadId,
      body: input as Record<string, WidgetData> | undefined,
      timeoutMs,
    });
    if (raw.networkError) {
      const { scopedTranslation } = await import("@/_pages/shared/i18n");
      const { t } = scopedTranslation.scopedT(locale);
      return {
        response: fail({
          message: t("error.message"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        }) as ResponseType<TDef["types"]["ResponseOutput"]>,
        status: 0,
        networkError: true,
      };
    }
    if (raw.body !== null) {
      return {
        response: JSON.parse(JSON.stringify(raw.body)) as ResponseType<
          TDef["types"]["ResponseOutput"]
        >,
        status: raw.status,
        networkError: false,
      };
    }
    const { scopedTranslation } = await import("@/_pages/shared/i18n");
    const { t } = scopedTranslation.scopedT(locale);
    return {
      response: fail({
        message: t("error.message"),
        errorType:
          raw.status === 401
            ? ErrorResponseTypes.UNAUTHORIZED
            : ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }) as ResponseType<TDef["types"]["ResponseOutput"]>,
      status: raw.status,
      networkError: false,
    };
  }
}
