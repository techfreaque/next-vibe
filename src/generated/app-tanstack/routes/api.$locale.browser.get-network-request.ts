// AUTO-GENERATED from src/app/api/[locale]/browser/get-network-request/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/browser/get-network-request",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/get-network-request/route"),
    ),
  },
});
