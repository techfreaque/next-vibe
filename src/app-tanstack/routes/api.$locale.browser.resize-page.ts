// AUTO-GENERATED from src/app/api/[locale]/browser/resize-page/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "next-vibe/platforms/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/resize-page",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/browser/resize-page/route"),
    ),
  },
});
