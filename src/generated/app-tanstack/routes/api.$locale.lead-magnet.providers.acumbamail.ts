// AUTO-GENERATED from src/lead-magnet/providers/acumbamail/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/lead-magnet/providers/acumbamail",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/lead-magnet/providers/acumbamail/route"),
    ),
  },
});
