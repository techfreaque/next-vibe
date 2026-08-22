// AUTO-GENERATED from src/analytics/evaluators/threshold/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/analytics/evaluators/threshold",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/analytics/evaluators/threshold/route"),
    ),
  },
});
