// AUTO-GENERATED from src/payment/data-sources/payments-refund-count/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/data-sources/payments-refund-count",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/data-sources/payments-refund-count/route"),
    ),
  },
});
