// AUTO-GENERATED from src/browser/get-console-message/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/get-console-message",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/get-console-message/route"),
    ),
  },
});
