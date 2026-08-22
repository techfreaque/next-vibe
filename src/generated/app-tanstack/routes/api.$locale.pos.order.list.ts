// AUTO-GENERATED from src/pos/order/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/pos/order/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/pos/order/list/route"),
    ),
  },
});
