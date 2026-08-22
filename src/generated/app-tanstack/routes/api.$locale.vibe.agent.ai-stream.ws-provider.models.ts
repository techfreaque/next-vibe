// AUTO-GENERATED from src/vibe/agent/ai-stream/ws-provider/models/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/ai-stream/ws-provider/models",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/ai-stream/ws-provider/models/route"),
    ),
  },
});
