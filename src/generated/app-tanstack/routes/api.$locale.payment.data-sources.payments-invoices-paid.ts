// AUTO-GENERATED from src/app/api/[locale]/payment/data-sources/payments-invoices-paid/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/data-sources/payments-invoices-paid",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/payment/data-sources/payments-invoices-paid/route"),
    ),
  },
});
