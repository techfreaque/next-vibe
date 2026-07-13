// AUTO-GENERATED from src/vibe/help-tool/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/help-tool")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/help-tool/route"),
    ),
  },
});
