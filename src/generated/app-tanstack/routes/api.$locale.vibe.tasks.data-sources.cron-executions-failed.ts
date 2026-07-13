// AUTO-GENERATED from src/vibe/tasks/data-sources/cron-executions-failed/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/tasks/data-sources/cron-executions-failed",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/tasks/data-sources/cron-executions-failed/route"),
    ),
  },
});
