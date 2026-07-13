// AUTO-GENERATED from src/payment/invoice/[invoiceId]/send/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/invoice/$invoiceId/send",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/invoice/[invoiceId]/send/route"),
    ),
  },
});
