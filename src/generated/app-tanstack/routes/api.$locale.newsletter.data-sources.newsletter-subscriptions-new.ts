// AUTO-GENERATED from src/newsletter/data-sources/newsletter-subscriptions-new/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/newsletter/data-sources/newsletter-subscriptions-new",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/newsletter/data-sources/newsletter-subscriptions-new/route"),
    ),
  },
});
