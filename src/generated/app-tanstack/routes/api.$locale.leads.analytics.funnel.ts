// AUTO-GENERATED from src/leads/analytics/funnel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/analytics/funnel")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/analytics/funnel/route"),
    ),
  },
});
