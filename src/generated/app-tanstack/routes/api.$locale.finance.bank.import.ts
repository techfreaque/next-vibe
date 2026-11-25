// AUTO-GENERATED from src/finance/bank/import/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/bank/import")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/bank/import/route"),
    ),
  },
});
