// AUTO-GENERATED from src/vibe/agent/chat/threads/files/[threadId]/[filename]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/chat/threads/files/$threadId/$filename",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/vibe/agent/chat/threads/files/[threadId]/[filename]/route"),
    ),
  },
});
