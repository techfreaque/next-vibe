/**
 * WS Channel Registry
 *
 * Index of every endpoint that exposes a WebSocket channel.
 * The WS server uses this to authorize channel subscriptions — role-based
 * checks come from each endpoint's allowedRoles; resource-level checks come
 * from canSubscribe declared on tools.METHOD in each route.ts.
 *
 * Add a new entry here whenever an endpoint gains an `events` block.
 */

import type { GenericHandlerBase } from "../shared/endpoints/route/handler";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";

export interface WsChannelEntry {
  endpoint: CreateApiEndpointAny;
  canSubscribe?: NonNullable<GenericHandlerBase["canSubscribe"]>;
}

export async function getWsEndpoints(): Promise<WsChannelEntry[]> {
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
    messagesRoute,
    skillByIdRoute,
    aiStreamRunRoute,
    skillsRoute,
    folderContentsRoute,
    favoritesRoute,
    threadsRoute,
    cronQueueRoute,
    cronTasksRoute,
    creditsRoute,
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
    import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/route"),
    import("@/app/api/[locale]/agent/chat/skills/[id]/route"),
    import("@/app/api/[locale]/agent/ai-stream/run/route"),
    import("@/app/api/[locale]/agent/chat/skills/route"),
    import("@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/route"),
    import("@/app/api/[locale]/agent/chat/favorites/route"),
    import("@/app/api/[locale]/agent/chat/threads/route"),
    import("@/app/api/[locale]/system/unified-interface/tasks/cron/queue/route"),
    import("@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/route"),
    import("@/app/api/[locale]/credits/route"),
  ]);

  return [
    {
      endpoint: messagesDef.default.GET,
      canSubscribe: messagesRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: skillByIdDef.default.GET,
      canSubscribe: skillByIdRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: aiStreamRunDef.default.POST,
      canSubscribe: aiStreamRunRoute.tools.POST.canSubscribe,
    },
    {
      endpoint: skillsDef.default.GET,
      canSubscribe: skillsRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: folderContentsDef.default.GET,
      canSubscribe: folderContentsRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: favoritesDef.default.GET,
      canSubscribe: favoritesRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: threadsDef.default.GET,
      canSubscribe: threadsRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: cronQueueDef.default.GET,
      canSubscribe: cronQueueRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: cronTasksDef.default.GET,
      canSubscribe: cronTasksRoute.tools.GET.canSubscribe,
    },
    {
      endpoint: creditsDef.default.GET,
      canSubscribe: creditsRoute.tools.GET.canSubscribe,
    },
  ];
}
