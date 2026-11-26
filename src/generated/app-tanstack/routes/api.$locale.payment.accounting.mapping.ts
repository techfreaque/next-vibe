// AUTO-GENERATED from src/payment/accounting/mapping/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/accounting/mapping")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/payment/accounting/mapping/route"),
      ),
    },
  },
);
