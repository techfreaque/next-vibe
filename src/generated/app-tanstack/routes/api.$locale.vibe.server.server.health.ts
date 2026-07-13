// AUTO-GENERATED from src/vibe/server/server/health/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/server/server/health")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/server/server/health/route"),
    ),
  },
});
