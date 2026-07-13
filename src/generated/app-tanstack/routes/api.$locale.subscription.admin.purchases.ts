// AUTO-GENERATED from src/subscription/admin/purchases/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/subscription/admin/purchases",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/admin/purchases/route"),
    ),
  },
});
