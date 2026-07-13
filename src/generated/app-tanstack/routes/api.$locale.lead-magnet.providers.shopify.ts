// AUTO-GENERATED from src/app/api/[locale]/lead-magnet/providers/shopify/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/lead-magnet/providers/shopify",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/lead-magnet/providers/shopify/route"),
    ),
  },
});
