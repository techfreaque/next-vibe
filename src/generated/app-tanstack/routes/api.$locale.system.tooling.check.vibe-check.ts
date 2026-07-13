// AUTO-GENERATED from src/vibe/tooling/check/vibe-check/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/tooling/check/vibe-check",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/tooling/check/vibe-check/route"),
    ),
  },
});
