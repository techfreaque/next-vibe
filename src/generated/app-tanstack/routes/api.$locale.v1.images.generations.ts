// AUTO-GENERATED from src/v1/images/generations/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/v1/images/generations")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/v1/images/generations/route"),
    ),
  },
});
