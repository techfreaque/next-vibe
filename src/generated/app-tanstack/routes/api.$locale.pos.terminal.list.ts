// AUTO-GENERATED from src/pos/terminal/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/pos/terminal/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/pos/terminal/list/route"),
    ),
  },
});
