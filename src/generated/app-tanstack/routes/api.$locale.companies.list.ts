// AUTO-GENERATED from src/companies/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/companies/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/companies/list/route"),
    ),
  },
});
