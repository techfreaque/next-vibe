// AUTO-GENERATED from src/vibe/server/server/rebuild/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/server/server/rebuild",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/server/server/rebuild/route"),
    ),
  },
});
