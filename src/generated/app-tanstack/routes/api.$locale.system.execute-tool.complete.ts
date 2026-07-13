// AUTO-GENERATED from src/vibe/execute-tool/complete/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/execute-tool/complete",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/execute-tool/complete/route"),
    ),
  },
});
