// AUTO-GENERATED from src/payment/providers/nowpayments/webhook/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/providers/nowpayments/webhook",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/providers/nowpayments/webhook/route"),
    ),
  },
});
