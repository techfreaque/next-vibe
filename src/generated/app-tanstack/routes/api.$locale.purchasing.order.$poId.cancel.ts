// AUTO-GENERATED from src/purchasing/order/[poId]/cancel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/purchasing/order/$poId/cancel",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/purchasing/order/[poId]/cancel/route"),
    ),
  },
});
