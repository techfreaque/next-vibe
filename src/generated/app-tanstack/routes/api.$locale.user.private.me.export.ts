// AUTO-GENERATED from src/user/private/me/export/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/private/me/export")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/private/me/export/route"),
    ),
  },
});
