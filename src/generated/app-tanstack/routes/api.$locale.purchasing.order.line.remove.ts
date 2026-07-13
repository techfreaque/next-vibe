// AUTO-GENERATED from src/app/api/[locale]/purchasing/order/line/remove/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/purchasing/order/line/remove",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/purchasing/order/line/remove/route"),
    ),
  },
});
