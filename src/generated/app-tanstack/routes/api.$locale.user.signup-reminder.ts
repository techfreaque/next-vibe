// AUTO-GENERATED from src/user/signup-reminder/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/signup-reminder")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/signup-reminder/route"),
    ),
  },
});
