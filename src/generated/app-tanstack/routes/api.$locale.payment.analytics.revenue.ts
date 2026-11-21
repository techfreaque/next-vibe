// AUTO-GENERATED from src/payment/analytics/revenue/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/analytics/revenue")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/analytics/revenue/route"),
    ),
  },
});
