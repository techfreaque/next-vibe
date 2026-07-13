// AUTO-GENERATED from src/vibe/tasks/unified-runner/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/tasks/unified-runner",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/tasks/unified-runner/route"),
    ),
  },
});
