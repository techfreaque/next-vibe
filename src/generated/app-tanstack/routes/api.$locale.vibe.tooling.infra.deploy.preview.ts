// AUTO-GENERATED from src/vibe/tooling/infra/deploy/preview/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/tooling/infra/deploy/preview",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/tooling/infra/deploy/preview/route"),
    ),
  },
});
