// AUTO-GENERATED from src/user/data-sources/users-email-verified/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/user/data-sources/users-email-verified",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/data-sources/users-email-verified/route"),
    ),
  },
});
