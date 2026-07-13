// AUTO-GENERATED from src/messenger/accounts/edit/[id]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/messenger/accounts/edit/$id",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/messenger/accounts/edit/[id]/route"),
    ),
  },
});
