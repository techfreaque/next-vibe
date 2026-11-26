// AUTO-GENERATED from src/pos/session/[sessionId]/register/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/pos/session/$sessionId/register",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/pos/session/[sessionId]/register/route"),
    ),
  },
});
