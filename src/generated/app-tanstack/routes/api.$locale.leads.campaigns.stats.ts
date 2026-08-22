// AUTO-GENERATED from src/leads/campaigns/stats/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/campaigns/stats")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/campaigns/stats/route"),
    ),
  },
});
