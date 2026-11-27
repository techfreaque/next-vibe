// AUTO-GENERATED from src/vibe/env/installer/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/env/installer")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/env/installer/route"),
    ),
  },
});
