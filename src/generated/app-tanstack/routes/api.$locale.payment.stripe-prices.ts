// AUTO-GENERATED from src/payment/stripe-prices/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/stripe-prices")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/stripe-prices/route"),
    ),
  },
});
