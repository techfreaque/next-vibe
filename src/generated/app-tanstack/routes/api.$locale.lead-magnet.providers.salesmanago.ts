// AUTO-GENERATED from src/lead-magnet/providers/salesmanago/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/lead-magnet/providers/salesmanago",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/lead-magnet/providers/salesmanago/route"),
    ),
  },
});
