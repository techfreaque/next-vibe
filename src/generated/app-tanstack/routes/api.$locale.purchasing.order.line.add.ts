// AUTO-GENERATED from src/purchasing/order/line/add/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/purchasing/order/line/add")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/purchasing/order/line/add/route"),
    ),
  },
});
