// AUTO-GENERATED from src/vibe/execute-tool/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/execute-tool")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/execute-tool/route"),
    ),
  },
});
