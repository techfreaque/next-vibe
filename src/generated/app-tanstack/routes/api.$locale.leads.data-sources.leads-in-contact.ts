// AUTO-GENERATED from src/leads/data-sources/leads-in-contact/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/leads/data-sources/leads-in-contact",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/data-sources/leads-in-contact/route"),
    ),
  },
});
