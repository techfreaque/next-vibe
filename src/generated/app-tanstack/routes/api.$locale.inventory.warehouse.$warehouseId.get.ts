// AUTO-GENERATED from src/inventory/warehouse/[warehouseId]/get/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/inventory/warehouse/$warehouseId/get",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/inventory/warehouse/[warehouseId]/get/route"),
    ),
  },
});
