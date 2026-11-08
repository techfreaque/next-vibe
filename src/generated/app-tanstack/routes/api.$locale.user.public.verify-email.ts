// AUTO-GENERATED from src/user/public/verify-email/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/public/verify-email")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/public/verify-email/route"),
    ),
  },
});
