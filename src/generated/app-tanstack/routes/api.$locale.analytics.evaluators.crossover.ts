// AUTO-GENERATED from src/analytics/evaluators/crossover/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/analytics/evaluators/crossover",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/analytics/evaluators/crossover/route"),
    ),
  },
});
