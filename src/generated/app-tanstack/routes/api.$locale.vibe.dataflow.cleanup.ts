// AUTO-GENERATED from src/vibe/dataflow/cleanup/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/dataflow/cleanup")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/dataflow/cleanup/route"),
    ),
  },
});
