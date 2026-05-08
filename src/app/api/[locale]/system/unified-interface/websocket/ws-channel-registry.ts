/**
 * WS Channel Registry
 *
 * Index of every endpoint that exposes a WebSocket channel.
 * The WS server uses this to authorize channel subscriptions — role-based
 * checks come from each endpoint's allowedRoles; resource-level checks come
 * from canSubscribe declared on tools.METHOD in each route.ts.
 *
 * Add a new entry here whenever an endpoint gains an `events` block.
 *
 * Route modules are imported lazily (only when canSubscribe is actually called)
 * to avoid circular initialization errors in the production webpack bundle.
 * Definition modules are safe to import eagerly since they have no side effects.
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
function lazyCanSubscribe(
  importRoute: () => Promise<{
    tools: Record<string, Partial<GenericHandlerBase>>;
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

export async function getWsEndpoints(): Promise<WsChannelEntry[]> {
  // Only import definition modules eagerly — these are lightweight and safe.
  const [
    messagesDef,
    skillByIdDef,
    aiStreamRunDef,
    skillsDef,
    folderContentsDef,
    favoritesDef,
    threadsDef,
    cronQueueDef,
    cronTasksDef,
    creditsDef,
  ] = await Promise.all([
    import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition"),
    import("@/app/api/[locale]/agent/chat/skills/[id]/definition"),
    import("@/app/api/[locale]/agent/ai-stream/run/definition"),
    import("@/app/api/[locale]/agent/chat/skills/definition"),
    import("@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition"),
    import("@/app/api/[locale]/agent/chat/favorites/definition"),
    import("@/app/api/[locale]/agent/chat/threads/definition"),
    import("@/app/api/[locale]/system/unified-interface/tasks/cron/queue/definition"),
    import("@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition"),
    import("@/app/api/[locale]/credits/definition"),
  ]);

  // Route modules are imported lazily via canSubscribe — only when a channel
  // match is found and resource-level authorization is needed.
  return [
    {
      endpoint: messagesDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () =>
          import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/route"),
        "GET",
      ),
    },
    {
      endpoint: skillByIdDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/agent/chat/skills/[id]/route"),
        "GET",
      ),
    },
    {
      endpoint: aiStreamRunDef.default.POST,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/agent/ai-stream/run/route"),
        "POST",
      ),
    },
    {
      endpoint: skillsDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/agent/chat/skills/route"),
        "GET",
      ),
    },
    {
      endpoint: folderContentsDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () =>
          import("@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/route"),
        "GET",
      ),
    },
    {
      endpoint: favoritesDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/agent/chat/favorites/route"),
        "GET",
      ),
    },
    {
      endpoint: threadsDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/agent/chat/threads/route"),
        "GET",
      ),
    },
    {
      endpoint: cronQueueDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () =>
          import("@/app/api/[locale]/system/unified-interface/tasks/cron/queue/route"),
        "GET",
      ),
    },
    {
      endpoint: cronTasksDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () =>
          import("@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/route"),
        "GET",
      ),
    },
    {
      endpoint: creditsDef.default.GET,
      canSubscribe: lazyCanSubscribe(
        () => import("@/app/api/[locale]/credits/route"),
        "GET",
      ),
    },
  ];
}
