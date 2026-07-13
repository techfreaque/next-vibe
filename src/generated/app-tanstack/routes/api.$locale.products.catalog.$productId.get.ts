// AUTO-GENERATED from src/app/api/[locale]/products/catalog/[productId]/get/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/products/catalog/$productId/get",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/products/catalog/[productId]/get/route"),
    ),
  },
});
