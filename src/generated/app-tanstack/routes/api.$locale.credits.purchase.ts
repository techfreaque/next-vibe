// AUTO-GENERATED from src/credits/purchase/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/credits/purchase")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/credits/purchase/route"),
    ),
  },
});
