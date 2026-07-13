// AUTO-GENERATED from src/lead-magnet/config/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/lead-magnet/config")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/lead-magnet/config/route"),
    ),
  },
});
