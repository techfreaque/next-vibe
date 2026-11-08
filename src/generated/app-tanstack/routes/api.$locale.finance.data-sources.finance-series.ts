// AUTO-GENERATED from src/finance/data-sources/finance-series/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/finance/data-sources/finance-series",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/data-sources/finance-series/route"),
    ),
  },
});
