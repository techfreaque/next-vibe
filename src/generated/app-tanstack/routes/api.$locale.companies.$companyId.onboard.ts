// AUTO-GENERATED from src/companies/[companyId]/onboard/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/companies/$companyId/onboard",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/companies/[companyId]/onboard/route"),
    ),
  },
});
