// AUTO-GENERATED from src/browser/performance-start-trace/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/performance-start-trace",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/performance-start-trace/route"),
    ),
  },
});
