// AUTO-GENERATED from src/leads/import/status/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/import/status")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/import/status/route"),
    ),
  },
});
