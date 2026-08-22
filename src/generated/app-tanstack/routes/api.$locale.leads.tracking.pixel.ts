// AUTO-GENERATED from src/leads/tracking/pixel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/tracking/pixel")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/tracking/pixel/route"),
    ),
  },
});
