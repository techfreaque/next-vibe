// AUTO-GENERATED from src/app/api/[locale]/desktop/move-window-to-monitor/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/desktop/move-window-to-monitor",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/desktop/move-window-to-monitor/route"),
    ),
  },
});
