// AUTO-GENERATED from src/vibe/agent/chat/threads/[threadId]/messages/path/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/chat/threads/$threadId/messages/path",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/chat/threads/[threadId]/messages/path/route"),
    ),
  },
});
