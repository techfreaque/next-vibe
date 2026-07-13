// AUTO-GENERATED from src/vibe/database/sql/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/database/sql")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/database/sql/route"),
    ),
  },
});
