// AUTO-GENERATED from src/app/api/[locale]/system/identity/tracking/pixel/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "next-vibe/platforms/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/identity/tracking/pixel",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/system/identity/tracking/pixel/route"),
    ),
  },
});
