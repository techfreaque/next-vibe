// AUTO-GENERATED from src/vibe/tooling/infra/cluster/init/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/tooling/infra/cluster/init",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/tooling/infra/cluster/init/route"),
    ),
  },
});
