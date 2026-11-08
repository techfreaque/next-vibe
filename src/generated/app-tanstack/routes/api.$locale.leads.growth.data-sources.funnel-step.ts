// AUTO-GENERATED from src/leads/growth/data-sources/funnel-step/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/leads/growth/data-sources/funnel-step",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/growth/data-sources/funnel-step/route"),
    ),
  },
});
