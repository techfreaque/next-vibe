// AUTO-GENERATED from src/api-keys/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/api-keys")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/api-keys/route"),
    ),
  },
});
