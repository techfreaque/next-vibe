// AUTO-GENERATED from src/leads/growth/links/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/growth/links")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/growth/links/route"),
    ),
  },
});
