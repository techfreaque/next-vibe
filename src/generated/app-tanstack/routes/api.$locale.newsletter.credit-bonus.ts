// AUTO-GENERATED from src/newsletter/credit-bonus/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/newsletter/credit-bonus")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/newsletter/credit-bonus/route"),
    ),
  },
});
