/**
 * Server-side Event Emitter
 *
 * Creates a typed emit() function for route handlers.
 * The emitter validates payloads against Zod schemas before broadcasting.
 *
 * Events are sent to the WS sidecar via HTTP POST, since the Next.js
 * process and WS sidecar run in separate processes.
 */

import "server-only";

import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { EventSchemas, TypedEmit, WsWireMessage } from "./types";

/** Cached sidecar URL — built lazily from PORT env var */
let sidecarUrl: string | null = null;

function getSidecarUrl(): string {
  if (sidecarUrl) {
    return sidecarUrl;
  }
  const nextPort = parseInt(process.env.PORT ?? "3000", 10);
  const wsPort = nextPort + 1000;
  // eslint-disable-next-line i18next/no-literal-string
  sidecarUrl = `http://127.0.0.1:${String(wsPort)}/publish`;
  return sidecarUrl;
}

/**
 * Publish a WS event to the sidecar (fire-and-forget HTTP POST).
 * Accepts the full wire message shape — channel, event name, and typed payload.
 */
export function publishWsEvent(
  msg: Omit<WsWireMessage, "seq">,
  logger: EndpointLogger,
): void {
  const payload = JSON.stringify(msg);

  fetch(getSidecarUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  }).catch((err) => {
    logger.warn("[WS Emitter] Failed to publish to WS sidecar", {
      error: err instanceof Error ? err.message : String(err),
      channel: msg.channel,
      event: msg.event,
    });
  });
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
        { errors: result.error.flatten().fieldErrors },
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
