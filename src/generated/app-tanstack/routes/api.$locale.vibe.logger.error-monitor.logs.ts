// AUTO-GENERATED from src/vibe/logger/error-monitor/logs/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/logger/error-monitor/logs",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/logger/error-monitor/logs/route"),
    ),
  },
});
