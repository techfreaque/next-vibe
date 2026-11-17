// AUTO-GENERATED from src/subscription/yearly-credits/backfill/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/subscription/yearly-credits/backfill",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/yearly-credits/backfill/route"),
    ),
  },
});
