// AUTO-GENERATED from src/analytics/transformers/merge/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/analytics/transformers/merge",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/analytics/transformers/merge/route"),
    ),
  },
});
