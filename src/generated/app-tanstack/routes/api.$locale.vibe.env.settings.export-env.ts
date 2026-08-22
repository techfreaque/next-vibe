// AUTO-GENERATED from src/vibe/env/settings/export-env/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/env/settings/export-env",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/env/settings/export-env/route"),
    ),
  },
});
