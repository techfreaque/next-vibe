// AUTO-GENERATED from src/vibe/agent/chat/storage/guest-media-cleanup/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/chat/storage/guest-media-cleanup",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/chat/storage/guest-media-cleanup/route"),
    ),
  },
});
