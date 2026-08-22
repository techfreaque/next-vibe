// AUTO-GENERATED from src/vibe/agent/describe-video/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/agent/describe-video")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/describe-video/route"),
    ),
  },
});
