// AUTO-GENERATED from src/referral/data-sources/referrals-payouts/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/referral/data-sources/referrals-payouts",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/referral/data-sources/referrals-payouts/route"),
    ),
  },
});
