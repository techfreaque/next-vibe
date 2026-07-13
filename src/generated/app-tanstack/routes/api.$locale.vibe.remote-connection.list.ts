// AUTO-GENERATED from src/vibe/remote-connection/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/remote-connection/list",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/remote-connection/list/route"),
    ),
  },
});
