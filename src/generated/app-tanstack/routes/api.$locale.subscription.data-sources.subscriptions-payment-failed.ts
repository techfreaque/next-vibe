// AUTO-GENERATED from src/app/api/[locale]/subscription/data-sources/subscriptions-payment-failed/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/subscription/data-sources/subscriptions-payment-failed",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/subscription/data-sources/subscriptions-payment-failed/route"),
    ),
  },
});
