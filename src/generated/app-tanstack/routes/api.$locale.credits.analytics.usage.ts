// AUTO-GENERATED from src/credits/analytics/usage/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/credits/analytics/usage")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/credits/analytics/usage/route"),
    ),
  },
});
