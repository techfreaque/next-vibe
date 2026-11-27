// AUTO-GENERATED from src/subscription/provider-switch/notify/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/subscription/provider-switch/notify",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/provider-switch/notify/route"),
    ),
  },
});
