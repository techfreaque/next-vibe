// AUTO-GENERATED from src/app/api/[locale]/tax/report/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/tax/report")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/tax/report/route"),
    ),
  },
});
