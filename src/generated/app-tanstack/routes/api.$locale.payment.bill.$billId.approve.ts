// AUTO-GENERATED from src/payment/bill/[billId]/approve/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/bill/$billId/approve",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/bill/[billId]/approve/route"),
    ),
  },
});
