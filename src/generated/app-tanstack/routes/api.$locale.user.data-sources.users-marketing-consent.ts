// AUTO-GENERATED from src/user/data-sources/users-marketing-consent/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/user/data-sources/users-marketing-consent",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/data-sources/users-marketing-consent/route"),
    ),
  },
});
