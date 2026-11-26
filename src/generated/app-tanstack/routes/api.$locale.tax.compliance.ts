// AUTO-GENERATED from src/tax/compliance/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/tax/compliance")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/tax/compliance/route"),
    ),
  },
});
