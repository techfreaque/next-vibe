// AUTO-GENERATED from src/analytics/indicators/clamp/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/analytics/indicators/clamp")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/analytics/indicators/clamp/route"),
      ),
    },
  },
);
