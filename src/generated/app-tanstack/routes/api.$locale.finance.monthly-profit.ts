// AUTO-GENERATED from src/finance/monthly-profit/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/monthly-profit")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/monthly-profit/route"),
    ),
  },
});
