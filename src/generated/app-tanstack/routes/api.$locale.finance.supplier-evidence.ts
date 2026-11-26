// AUTO-GENERATED from src/finance/supplier-evidence/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/supplier-evidence")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/finance/supplier-evidence/route"),
    ),
  },
});
