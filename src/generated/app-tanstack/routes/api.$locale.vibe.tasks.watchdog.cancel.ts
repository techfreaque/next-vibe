// AUTO-GENERATED from src/vibe/tasks/watchdog/cancel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/tasks/watchdog/cancel")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/vibe/tasks/watchdog/cancel/route"),
      ),
    },
  },
);
