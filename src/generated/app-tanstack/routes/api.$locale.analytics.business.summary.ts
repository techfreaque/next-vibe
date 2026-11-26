// AUTO-GENERATED from src/analytics/business/summary/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/analytics/business/summary")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/analytics/business/summary/route"),
      ),
    },
  },
);
