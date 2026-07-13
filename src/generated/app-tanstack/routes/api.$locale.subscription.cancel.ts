// AUTO-GENERATED from src/subscription/cancel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/subscription/cancel")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/cancel/route"),
    ),
  },
});
