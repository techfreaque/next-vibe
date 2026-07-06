// AUTO-GENERATED from src/app/api/[locale]/chart-of-accounts/reports/trial-balance/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/chart-of-accounts/reports/trial-balance",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/app/api/[locale]/chart-of-accounts/reports/trial-balance/route"),
    ),
  },
});
