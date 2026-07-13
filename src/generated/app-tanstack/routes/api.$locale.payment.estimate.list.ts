// AUTO-GENERATED from src/payment/estimate/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/estimate/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/estimate/list/route"),
    ),
  },
});
