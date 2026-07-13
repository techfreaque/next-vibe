// AUTO-GENERATED from src/browser/list-console-messages/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/list-console-messages",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/list-console-messages/route"),
    ),
  },
});
