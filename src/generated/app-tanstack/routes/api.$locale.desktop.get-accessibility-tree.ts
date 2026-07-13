// AUTO-GENERATED from src/desktop/get-accessibility-tree/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/desktop/get-accessibility-tree",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/desktop/get-accessibility-tree/route"),
    ),
  },
});
