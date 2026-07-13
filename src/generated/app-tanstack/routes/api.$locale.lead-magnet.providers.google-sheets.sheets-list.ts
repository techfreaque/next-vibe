// AUTO-GENERATED from src/lead-magnet/providers/google-sheets/sheets-list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/lead-magnet/providers/google-sheets/sheets-list",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/lead-magnet/providers/google-sheets/sheets-list/route"),
    ),
  },
});
