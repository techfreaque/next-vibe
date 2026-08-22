// AUTO-GENERATED from src/referral/codes/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/referral/codes/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/referral/codes/list/route"),
    ),
  },
});
