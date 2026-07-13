// AUTO-GENERATED from src/inventory/transfer/[transferId]/dispatch/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/inventory/transfer/$transferId/dispatch",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/inventory/transfer/[transferId]/dispatch/route"),
    ),
  },
});
