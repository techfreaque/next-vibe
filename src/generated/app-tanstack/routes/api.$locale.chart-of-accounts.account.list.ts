// AUTO-GENERATED from src/app/api/[locale]/chart-of-accounts/account/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/chart-of-accounts/account/list",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/chart-of-accounts/account/list/route"),
    ),
  },
});
