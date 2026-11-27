// AUTO-GENERATED from src/finance/bank/split/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/bank/split")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/bank/split/route"),
    ),
  },
});
