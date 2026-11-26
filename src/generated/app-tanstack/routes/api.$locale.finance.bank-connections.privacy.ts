// AUTO-GENERATED from src/finance/bank-connections/privacy/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/finance/bank-connections/privacy",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/bank-connections/privacy/route"),
    ),
  },
});
