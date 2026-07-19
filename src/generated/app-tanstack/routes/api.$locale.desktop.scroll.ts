// AUTO-GENERATED from src/desktop/scroll/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/desktop/scroll")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/desktop/scroll/route"),
    ),
  },
});
