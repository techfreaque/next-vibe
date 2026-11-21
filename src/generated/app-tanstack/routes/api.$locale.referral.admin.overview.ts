// AUTO-GENERATED from src/referral/admin/overview/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/referral/admin/overview")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/referral/admin/overview/route"),
    ),
  },
});
