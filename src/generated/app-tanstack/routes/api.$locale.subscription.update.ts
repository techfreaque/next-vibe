// AUTO-GENERATED from src/subscription/update/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/subscription/update")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/update/route"),
    ),
  },
});
