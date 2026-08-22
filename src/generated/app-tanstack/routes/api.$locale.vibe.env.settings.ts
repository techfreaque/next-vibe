// AUTO-GENERATED from src/vibe/env/settings/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/env/settings")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/env/settings/route"),
    ),
  },
});
