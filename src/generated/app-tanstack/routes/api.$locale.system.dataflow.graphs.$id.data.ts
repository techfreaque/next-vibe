// AUTO-GENERATED from src/app/api/[locale]/system/dataflow/graphs/[id]/data/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/dataflow/graphs/$id/data",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/system/dataflow/graphs/[id]/data/route"),
    ),
  },
});
