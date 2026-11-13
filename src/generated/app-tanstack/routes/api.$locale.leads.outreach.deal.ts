// AUTO-GENERATED from src/leads/outreach/deal/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/outreach/deal")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/outreach/deal/route"),
    ),
  },
});
