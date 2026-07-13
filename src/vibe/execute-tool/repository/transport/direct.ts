/**
 * Direct-HTTP transport leg — the synchronous control-plane POST to the peer's
 * execute-tool endpoint (result IS the response). AI tool dispatch never rides
 * this: it uses the tool-execute-request event protocol on every transport.
 */
import "server-only";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";

import { BEARER_LEAD_ID_SEPARATOR } from "@/_old/config/constants";

import type { RouteExecuteResponseOutput } from "../../definition";
import executeDefinition from "../../definition";
import type { DirectCallResult, RouteExecuteContext } from "../types";

/**
 * Synchronous direct-http remote call: POST the target tool to the peer's
 * execute-tool endpoint and return its response. Wire plumbing only — it does
 * NOT re-enter the local execute() dispatch (which would recurse). Used solely
 * by the direct-http WAIT/END_LOOP leg.
 */
export async function callToolDirect(params: {
  remoteUrl: string;
  token: string;
  leadId: string;
  toolName: string;
  input: Record<string, WidgetData> | null;
  locale: string;
  logger: RouteExecuteContext["logger"];
  toolTimeoutMs?: number;
}): Promise<DirectCallResult> {
  const { remoteUrl, token, leadId, toolName, input, locale, logger } = params;
  const url = `${remoteUrl}/api/${locale}/${executeDefinition.POST.path.join("/")}`;
  const timeoutMs =
    params.toolTimeoutMs === 0 ? 600_000 : (params.toolTimeoutMs ?? 90_000);
  // The dev HTTP layer (vite/nitro) flakily drops multi-MB request bodies
  // ("socket closed unexpectedly" while reading) and answers with its
  // pre-handler {"unhandled":true} 500 — the handler never ran, so a retry is
  // side-effect free. ONLY that exact marker is retried; handler errors never.
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // This IS the direct-http dispatch primitive that runInProcessTyped/execute()
      // sits on top of — it POSTs the tool to the peer's execute-tool endpoint and
      // must NOT re-enter execute() (would recurse). The one place raw fetch is the
      // irreducible wire for cross-instance dispatch.
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- cross-instance dispatch primitive
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`,
          // Keepalive socket reuse corrupts multi-MB bodies between Bun's
          // fetch and the peer's HTTP layer (measured: 3/6 uploads of a 5MB
          // JSON body stall ~12s and die with "socket closed unexpectedly";
          // with Connection: close it is 0/6). A fresh connection per
          // dispatch costs one localhost/LAN handshake and makes delivery
          // deterministic.
          Connection: "close",
        },
        body: JSON.stringify({
          toolName,
          input: input ?? {},
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!resp.ok) {
        // Surface the peer's real error (e.g. "Read-Only" from a forbidden cortex
        // write) instead of collapsing every failure into an opaque local error —
        // the AI/caller needs the actual reason to react correctly.
        let remoteMessage: string | undefined;
        let preHandlerFailure = false;
        try {
          const errBody = (await resp.json()) as ErrorResponseType;
          remoteMessage = errBody.message;
          // A non-JSON or unhandled pre-handler error (Vite/Nitro 500 with
          // {unhandled:true}) won't parse as ErrorResponseType — catch handles it.
          preHandlerFailure = remoteMessage === undefined;
        } catch {
          remoteMessage = undefined;
          // A response whose body isn't even JSON (dev proxy HTML error page,
          // empty 400/431 after a truncated multi-MB upload) never came from
          // a handler — our handlers always answer JSON with a message. The
          // handler had no valid input, so it provably never ran.
          preHandlerFailure = true;
        }
        // 405 = the dev router rejected the METHOD while its route tree was
        // (re)building — the handler PROVABLY never ran, so this is retriable
        // for every tool, including non-idempotent (timeoutMs:0) ones.
        const routerNotReady = resp.status === 405;
        // Pre-handler failures are retried for EVERY tool: the body never
        // parsed, so the handler provably never ran and no side effects
        // exist — the retry is the FIRST real delivery.
        if ((routerNotReady || preHandlerFailure) && attempt < maxAttempts) {
          logger.warn(
            "[RouteExecute] callToolDirect pre-handler failure — retrying",
            { toolName, status: resp.status, attempt },
          );
          // The dev HTTP layer drops large bodies in bursts — an immediate
          // resend hits the same stressed socket pool and fails identically.
          // A short backoff lets the proxy recover before the retry.
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 750 * attempt);
          });
          continue;
        }
        logger.warn("[RouteExecute] callToolDirect HTTP error", {
          toolName,
          status: resp.status,
          remoteMessage,
        });
        return { ok: false, remoteMessage };
      }
      const body =
        (await resp.json()) as ResponseType<RouteExecuteResponseOutput>;
      if (!body.success) {
        return { ok: false, remoteMessage: String(body.message) };
      }
      return { ok: true, data: body.data };
    } catch (err) {
      logger.warn("[RouteExecute] callToolDirect network error", {
        toolName,
        error: err instanceof Error ? err.message : String(err),
      });
      return { ok: false };
    }
  }
  return { ok: false };
}
