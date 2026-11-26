// AUTO-GENERATED from src/payment/cost-backfill/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/cost-backfill")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/cost-backfill/route"),
    ),
  },
});
