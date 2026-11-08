// AUTO-GENERATED from src/newsletter/unsubscribe/oneclick/[token]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/newsletter/unsubscribe/oneclick/$token",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/newsletter/unsubscribe/oneclick/[token]/route"),
    ),
  },
});
