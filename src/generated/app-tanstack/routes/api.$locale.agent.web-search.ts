// AUTO-GENERATED from src/app/api/[locale]/agent/web-search/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/agent/web-search")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/agent/web-search/route"),
    ),
  },
});
