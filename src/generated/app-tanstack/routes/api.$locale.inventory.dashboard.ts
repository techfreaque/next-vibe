// AUTO-GENERATED from src/inventory/dashboard/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/inventory/dashboard")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/inventory/dashboard/route"),
    ),
  },
});
