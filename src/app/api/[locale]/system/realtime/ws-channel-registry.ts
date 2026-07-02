/**
 * WS Channel Registry
 *
 * Index of every endpoint that exposes a client-subscribable WebSocket channel.
 * The WS server uses this to authorize channel subscriptions — role-based checks
 * come from each endpoint's allowedRoles; resource-level checks (and the channel
 * the events ride) come from `resolveChannel` on tools.METHOD in each route.ts.
 * A `user`-scope channel needs no route resolver — the generator wires the static
 * `userChannelResolver` for it (events ride the caller's own user/{id} channel).
 *
 * The list is DEFINITION-DRIVEN: any endpoint method that declares an `events`
 * block with at least one client-delivered event (an event without
 * `clientDelivery: false`) is auto-discovered by the route-handlers generator
 * and emitted into the generated ws-channels.ts. Add `events:` + `channel:` to a
 * definition, run `vibe gen`, and the channel becomes authorizable — no manual
 * edits here.
 *
 * This module keeps the shared WsChannelEntry type and the lazyResolveChannel
 * helper (consumed by the generated file) and re-exports the generated list.
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";

export interface WsChannelEntry {
  endpoint: CreateApiEndpointAny;
  resolveChannel?: NonNullable<GenericHandlerBase["resolveChannel"]>;
}

/**
 * Create a lazy resolveChannel that defers the route import until first call.
 * This avoids importing route modules (which pull in repositories, DB, etc.)
 * during WS channel registration — preventing circular init errors in prod.
 *
 * FAIL-CLOSED: if the route does not declare `resolveChannel` on the exact
 * `method` this channel was registered on, the subscription is DENIED (returns
 * `{ kind: "deny" }`). The generator (`validateWsChannels`) guarantees a resolver
 * exists at build time, so reaching the deny branch means the generated registry
 * is stale or hand-edited — denying is the only safe outcome. A resolver placed
 * on the wrong method (e.g. on GET when events live on PATCH) is exactly this
 * case and is now a deny, not a silent allow.
 */
/**
 * The static resolver for a `scope: "user"` channel: events ride the caller's own
 * `user/{id}` channel, so the identity IS the boundary — no route code, no DB.
 * The generator wires this directly for every user-scoped channel.
 */
export const userChannelResolver: NonNullable<
  GenericHandlerBase["resolveChannel"]
> = () => ({ kind: "user" });

/**
 * A route module as the registry consumes it — only the `tools` map matters, and
 * within it only `resolveChannel`. The resolver is accepted via a method
 * declaration (`bivarianceHack`) so a route's CONCRETE resolver — narrower
 * urlPathParams/requestData than the erased base — is assignable here without a
 * cast: TypeScript treats method parameters bivariantly, which is exactly the
 * variance we want at this type-erased registration boundary. Generic over the
 * route module so each `import("…/route")` keeps its own type.
 */
interface RegistryRouteModule {
  tools: Record<
    string,
    | { resolveChannel?: NonNullable<GenericHandlerBase["resolveChannel"]> }
    | undefined
  >;
}

export function lazyResolveChannel<TRoute extends RegistryRouteModule>(
  importRoute: () => Promise<TRoute>,
  method: string,
): NonNullable<GenericHandlerBase["resolveChannel"]> {
  let cached: NonNullable<GenericHandlerBase["resolveChannel"]> | null = null;

  return async (ctx) => {
    if (!cached) {
      const routeModule = await importRoute();
      const handler = routeModule.tools[method];
      if (!handler?.resolveChannel) {
        ctx.logger.error(
          `[WS] DENY — no resolveChannel on method ${method}; channel is fail-closed. ` +
            `Run \`vibe gen\` to regenerate the ws-channel registry.`,
        );
        return { kind: "deny" };
      }
      cached = handler.resolveChannel;
    }
    return cached(ctx);
  };
}

/**
 * Returns every endpoint that exposes a client-subscribable WebSocket channel.
 *
 * Delegates to the generated ws-channels.ts (produced by the route-handlers
 * generator from every definition that declares a client-delivered event).
 * The generated list eagerly imports definitions and lazily wires resolveChannel
 * from routes via lazyResolveChannel above.
 */
export async function getWsEndpoints(): Promise<WsChannelEntry[]> {
  const { getGeneratedWsEndpoints } =
    await import("@/generated/routes/ws-channels");
  return getGeneratedWsEndpoints();
}
