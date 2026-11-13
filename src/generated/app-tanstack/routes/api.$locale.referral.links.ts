// AUTO-GENERATED from src/referral/links/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/referral/links")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/referral/links/route"),
    ),
  },
});
