// AUTO-GENERATED from src/payment/dashboard/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/dashboard")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/dashboard/route"),
    ),
  },
});
