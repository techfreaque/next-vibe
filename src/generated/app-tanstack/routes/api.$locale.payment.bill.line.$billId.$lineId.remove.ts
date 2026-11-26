// AUTO-GENERATED from src/payment/bill/line/[billId]/[lineId]/remove/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/bill/line/$billId/$lineId/remove",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/bill/line/[billId]/[lineId]/remove/route"),
    ),
  },
});
