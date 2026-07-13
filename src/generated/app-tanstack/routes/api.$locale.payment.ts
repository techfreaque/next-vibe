// AUTO-GENERATED from src/payment/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/route"),
    ),
  },
});
