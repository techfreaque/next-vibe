// AUTO-GENERATED from src/leads/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/list/route"),
    ),
  },
});
