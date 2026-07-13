// AUTO-GENERATED from src/vibe/tasks/cron/bulk/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/tasks/cron/bulk")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/tasks/cron/bulk/route"),
    ),
  },
});
