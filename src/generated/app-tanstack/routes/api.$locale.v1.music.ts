// AUTO-GENERATED from src/v1/music/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/v1/music")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/v1/music/route"),
    ),
  },
});
