// AUTO-GENERATED from src/vibe/dataflow/run-config/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/dataflow/run-config")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("next-vibe/dataflow/run-config/route"),
      ),
    },
  },
);
