/**
 * Server-side Event Emitter
 *
 * Creates a typed emit() function for route handlers.
 * The emitter validates payloads against Zod schemas before broadcasting.
 *
 * Next.js runs in a separate process from the Bun proxy. To broadcast WS events,
 * route handlers POST to the proxy's internal /ws/broadcast endpoint which calls
 * broadcastLocal() in-process where the WS connections live.
 */

import "server-only";

import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { EventSchemas, TypedEmit, WsWireMessage } from "./types";

/**
 * Derive the proxy's internal broadcast URL.
 * In proxy mode (default): proxy is on NEXT_PUBLIC_APP_URL's port.
 * In direct mode (VIBE_DISABLE_PROXY): WS sidecar is on main port + 1000.
 */
function getBroadcastUrl(): string {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const disableProxy = process.env["VIBE_DISABLE_PROXY"] === "true";
    const wsPort = disableProxy ? mainPort + 1000 : mainPort;
    return `http://127.0.0.1:${wsPort}/ws/broadcast`;
  } catch {
    return "http://127.0.0.1:3000/ws/broadcast";
  }
}

/**
 * Publish a WS event - POST to the Bun proxy's internal broadcast endpoint.
 * Fire-and-forget: errors are logged but not thrown.
 */
export function publishWsEvent(
  msg: Omit<WsWireMessage, "seq">,
  logger: EndpointLogger,
): void {
  const url = getBroadcastUrl();
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(msg),
  }).catch((err) => {
    if (!shuttingDown) {
      logger.warn("[WS Emitter] Failed to broadcast event", {
        error: err instanceof Error ? err.message : String(err),
        channel: msg.channel,
        event: msg.event,
      });
    }
  });
}

/** Set to true during shutdown to suppress expected broadcast errors */
let shuttingDown = false;
export function setShuttingDown(): void {
  shuttingDown = true;
}

/**
 * Create a typed emit function scoped to a specific channel.
 *
 * @param channel - The channel to broadcast events on
 * @param eventSchemas - Record of event name → Zod schema (from definition.events)
 * @param logger - Endpoint logger for error reporting
 * @returns A typed emit function that validates and broadcasts events
 */
export function createEmitter<TEvents extends EventSchemas | never>(
  channel: string,
  eventSchemas: TEvents,
  logger: EndpointLogger,
): TypedEmit<TEvents> {
  return (<K extends keyof TEvents & string>(
    event: K,
    data: z.input<TEvents[K]>,
  ): void => {
    const schema = eventSchemas[event];
    if (!schema) {
      logger.warn(
        `[WS Emitter] Unknown event "${event}" for channel "${channel}"`,
      );
      return;
    }

    // Validate payload against schema
    const result = schema.safeParse(data);
    if (!result.success) {
      logger.warn(
        `[WS Emitter] Invalid payload for event "${event}" on channel "${channel}"`,
        {
          errors: result.error.flatten().fieldErrors,
        },
      );
      return;
    }

    publishWsEvent(
      {
        channel,
        event,
        data: result.data,
      },
      logger,
    );
  }) as TypedEmit<TEvents>;
}
