// AUTO-GENERATED from src/vibe/env/settings/generate-key/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/env/settings/generate-key",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/env/settings/generate-key/route"),
    ),
  },
});
