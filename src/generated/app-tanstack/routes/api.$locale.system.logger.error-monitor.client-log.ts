// AUTO-GENERATED from src/vibe/logger/error-monitor/client-log/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/logger/error-monitor/client-log",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/logger/error-monitor/client-log/route"),
    ),
  },
});
