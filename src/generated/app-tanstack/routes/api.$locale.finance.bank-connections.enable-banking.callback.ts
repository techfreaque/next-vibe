// AUTO-GENERATED from src/finance/bank-connections/enable-banking/callback/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/finance/bank-connections/enable-banking/callback",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/bank-connections/enable-banking/callback/route"),
    ),
  },
});
