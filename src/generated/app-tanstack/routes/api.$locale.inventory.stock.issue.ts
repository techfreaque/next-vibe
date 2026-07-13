// AUTO-GENERATED from src/inventory/stock/issue/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/inventory/stock/issue")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/inventory/stock/issue/route"),
    ),
  },
});
