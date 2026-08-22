// AUTO-GENERATED from src/chart-of-accounts/ledger/[accountId]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/chart-of-accounts/ledger/$accountId",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/chart-of-accounts/ledger/[accountId]/route"),
    ),
  },
});
