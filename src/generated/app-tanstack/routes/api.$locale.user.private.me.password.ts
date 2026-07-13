// AUTO-GENERATED from src/app/api/[locale]/user/private/me/password/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/private/me/password")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/private/me/password/route"),
    ),
  },
});
