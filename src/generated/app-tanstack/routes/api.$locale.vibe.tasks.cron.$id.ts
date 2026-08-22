// AUTO-GENERATED from src/vibe/tasks/cron/[id]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/tasks/cron/$id")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/tasks/cron/[id]/route"),
    ),
  },
});
