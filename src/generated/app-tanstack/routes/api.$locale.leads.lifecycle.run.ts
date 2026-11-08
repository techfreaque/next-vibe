// AUTO-GENERATED from src/leads/lifecycle/run/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/lifecycle/run")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/lifecycle/run/route"),
    ),
  },
});
