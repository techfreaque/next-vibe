// AUTO-GENERATED from src/payment/portal/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/portal")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/portal/route"),
    ),
  },
});
