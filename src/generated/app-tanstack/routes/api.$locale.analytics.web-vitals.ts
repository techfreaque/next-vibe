// AUTO-GENERATED from src/analytics/web-vitals/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/analytics/web-vitals")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/analytics/web-vitals/route"),
    ),
  },
});
