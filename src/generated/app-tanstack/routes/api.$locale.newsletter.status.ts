// AUTO-GENERATED from src/newsletter/status/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/newsletter/status")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/newsletter/status/route"),
    ),
  },
});
