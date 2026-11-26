// AUTO-GENERATED from src/pos/fiscal/settings/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/pos/fiscal/settings")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/pos/fiscal/settings/route"),
    ),
  },
});
