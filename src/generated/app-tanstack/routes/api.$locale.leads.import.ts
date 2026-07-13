// AUTO-GENERATED from src/app/api/[locale]/leads/import/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/import")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/import/route"),
    ),
  },
});
