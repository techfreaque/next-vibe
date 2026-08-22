// AUTO-GENERATED from src/companies/[companyId]/members/[memberId]/remove/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/companies/$companyId/members/$memberId/remove",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/companies/[companyId]/members/[memberId]/remove/route"),
    ),
  },
});
