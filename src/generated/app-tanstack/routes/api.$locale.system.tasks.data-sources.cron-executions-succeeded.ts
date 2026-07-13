// AUTO-GENERATED from src/vibe/tasks/data-sources/cron-executions-succeeded/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/tasks/data-sources/cron-executions-succeeded",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/tasks/data-sources/cron-executions-succeeded/route"),
    ),
  },
});
