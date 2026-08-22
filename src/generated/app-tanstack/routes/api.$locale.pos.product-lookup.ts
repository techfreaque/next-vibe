// AUTO-GENERATED from src/pos/product-lookup/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/pos/product-lookup")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/pos/product-lookup/route"),
    ),
  },
});
