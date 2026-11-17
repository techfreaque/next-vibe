// AUTO-GENERATED from src/referral/admin/code-bonus/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/referral/admin/code-bonus")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/referral/admin/code-bonus/route"),
    ),
  },
});
