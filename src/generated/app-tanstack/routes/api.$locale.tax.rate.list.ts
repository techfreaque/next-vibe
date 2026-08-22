// AUTO-GENERATED from src/tax/rate/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/tax/rate/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/tax/rate/list/route"),
    ),
  },
});
