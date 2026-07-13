// AUTO-GENERATED from src/analytics/transformers/json-path/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/analytics/transformers/json-path",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/analytics/transformers/json-path/route"),
    ),
  },
});
