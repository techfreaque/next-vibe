// AUTO-GENERATED from src/payment/whop-catalog/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/whop-catalog")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/whop-catalog/route"),
    ),
  },
});
