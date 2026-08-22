// AUTO-GENERATED from src/products/catalog/create/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/products/catalog/create")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/products/catalog/create/route"),
    ),
  },
});
