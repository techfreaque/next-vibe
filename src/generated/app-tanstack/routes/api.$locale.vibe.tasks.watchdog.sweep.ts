// AUTO-GENERATED from src/vibe/tasks/watchdog/sweep/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/tasks/watchdog/sweep")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/tasks/watchdog/sweep/route"),
    ),
  },
});
