// AUTO-GENERATED from src/vibe/realtime/remote-event-bridge/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/realtime/remote-event-bridge",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/realtime/remote-event-bridge/route"),
    ),
  },
});
