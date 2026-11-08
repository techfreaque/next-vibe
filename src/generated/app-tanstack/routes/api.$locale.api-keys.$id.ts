// AUTO-GENERATED from src/api-keys/[id]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/api-keys/$id")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/api-keys/[id]/route"),
    ),
  },
});
