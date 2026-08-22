// AUTO-GENERATED from src/lead-magnet/providers/google-sheets/oauth/callback/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/lead-magnet/providers/google-sheets/oauth/callback",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/lead-magnet/providers/google-sheets/oauth/callback/route"),
    ),
  },
});
