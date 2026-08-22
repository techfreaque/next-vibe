// AUTO-GENERATED from src/browser/performance-analyze-insight/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/performance-analyze-insight",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/performance-analyze-insight/route"),
    ),
  },
});
