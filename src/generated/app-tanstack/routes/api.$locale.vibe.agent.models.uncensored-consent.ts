// AUTO-GENERATED from src/vibe/agent/models/uncensored-consent/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/models/uncensored-consent",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/models/uncensored-consent/route"),
    ),
  },
});
