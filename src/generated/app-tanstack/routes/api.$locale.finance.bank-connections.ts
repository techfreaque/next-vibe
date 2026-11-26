// AUTO-GENERATED from src/finance/bank-connections/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/bank-connections")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/bank-connections/route"),
    ),
  },
});
