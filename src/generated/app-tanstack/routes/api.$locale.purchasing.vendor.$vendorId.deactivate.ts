// AUTO-GENERATED from src/purchasing/vendor/[vendorId]/deactivate/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/purchasing/vendor/$vendorId/deactivate",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/purchasing/vendor/[vendorId]/deactivate/route"),
    ),
  },
});
