// AUTO-GENERATED from src/subscription/company/[companyId]/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/subscription/company/$companyId/list",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/company/[companyId]/list/route"),
    ),
  },
});
