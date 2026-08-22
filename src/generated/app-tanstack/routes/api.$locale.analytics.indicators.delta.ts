// AUTO-GENERATED from src/analytics/indicators/delta/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/analytics/indicators/delta")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/analytics/indicators/delta/route"),
      ),
    },
  },
);
