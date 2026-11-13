// AUTO-GENERATED from src/credits/data-sources/credits-farming-blocked/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/credits/data-sources/credits-farming-blocked",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/credits/data-sources/credits-farming-blocked/route"),
    ),
  },
});
