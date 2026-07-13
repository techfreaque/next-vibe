// AUTO-GENERATED from src/vibe/dataflow/graphs/[id]/versions/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/dataflow/graphs/$id/versions",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/dataflow/graphs/[id]/versions/route"),
    ),
  },
});
