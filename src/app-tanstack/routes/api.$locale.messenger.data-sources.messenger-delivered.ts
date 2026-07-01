// AUTO-GENERATED from src/app/api/[locale]/messenger/data-sources/messenger-delivered/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "next-vibe/platforms/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/messenger/data-sources/messenger-delivered",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/messenger/data-sources/messenger-delivered/route"),
    ),
  },
});
