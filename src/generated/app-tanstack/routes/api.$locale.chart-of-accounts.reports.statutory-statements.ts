// AUTO-GENERATED from src/chart-of-accounts/reports/statutory-statements/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/chart-of-accounts/reports/statutory-statements",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/chart-of-accounts/reports/statutory-statements/route"),
    ),
  },
});
