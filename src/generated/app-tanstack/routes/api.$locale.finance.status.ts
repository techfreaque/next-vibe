// AUTO-GENERATED from src/finance/status/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/status")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/status/route"),
    ),
  },
});
