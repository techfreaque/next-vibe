// AUTO-GENERATED from src/vibe/remote-connection/connect-reverse/update/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/remote-connection/connect-reverse/update",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/remote-connection/connect-reverse/update/route"),
    ),
  },
});
