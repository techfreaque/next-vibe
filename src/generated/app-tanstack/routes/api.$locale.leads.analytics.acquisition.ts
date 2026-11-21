// AUTO-GENERATED from src/leads/analytics/acquisition/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/leads/analytics/acquisition",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/analytics/acquisition/route"),
    ),
  },
});
