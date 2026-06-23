/**
 * WS Channel Registry
 *
 * Index of every endpoint that exposes a client-subscribable WebSocket channel.
 * The WS server uses this to authorize channel subscriptions — role-based
 * checks come from each endpoint's allowedRoles; resource-level checks come
 * from canSubscribe declared on tools.METHOD in each route.ts.
 *
 * The list is DEFINITION-DRIVEN: any endpoint method that declares an `events`
 * block with at least one client-delivered event (an event without
 * `clientDelivery: false`) is auto-discovered by the route-handlers generator
 * and emitted into the generated ws-channels.ts. Add `events:` to a definition,
 * run `vibe gen`, and the channel becomes authorizable — no manual edits here.
 *
 * This module keeps the shared WsChannelEntry type and the lazyCanSubscribe
 * helper (consumed by the generated file) and re-exports the generated list.
 */

import type { GenericHandlerBase } from "../shared/endpoints/route/handler";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";

export interface WsChannelEntry {
  endpoint: CreateApiEndpointAny;
  canSubscribe?: NonNullable<GenericHandlerBase["canSubscribe"]>;
}

/**
 * Create a lazy canSubscribe that defers the route import until first call.
 * This avoids importing route modules (which pull in repositories, DB, etc.)
 * during WS channel registration — preventing circular init errors in prod.
 */
export function lazyCanSubscribe(
  importRoute: () => Promise<{
    tools: Record<
      string,
      { canSubscribe?: GenericHandlerBase["canSubscribe"] }
    >;
  }>,
  method: string,
): NonNullable<GenericHandlerBase["canSubscribe"]> {
  let cached: NonNullable<GenericHandlerBase["canSubscribe"]> | null = null;

  return async (ctx) => {
    if (!cached) {
      const routeModule = await importRoute();
      const handler = routeModule.tools[method];
      if (!handler?.canSubscribe) {
        return true;
      }
      cached = handler.canSubscribe;
    }
    return cached(ctx);
  };
}

/**
 * Returns every endpoint that exposes a client-subscribable WebSocket channel.
 *
 * Delegates to the generated ws-channels.ts (produced by the route-handlers
 * generator from every definition that declares a client-delivered event).
 * The generated list eagerly imports definitions and lazily wires canSubscribe
 * from routes via lazyCanSubscribe above.
 */
export async function getWsEndpoints(): Promise<WsChannelEntry[]> {
  const { getGeneratedWsEndpoints } =
    await import("../../generated/ws-channels");
  return getGeneratedWsEndpoints();
}
