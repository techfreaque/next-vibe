// AUTO-GENERATED from src/inventory/transfer/[transferId]/get/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/inventory/transfer/$transferId/get",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/inventory/transfer/[transferId]/get/route"),
    ),
  },
});
