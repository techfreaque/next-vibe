// AUTO-GENERATED from src/companies/[companyId]/members/invite/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/companies/$companyId/members/invite",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/companies/[companyId]/members/invite/route"),
    ),
  },
});
