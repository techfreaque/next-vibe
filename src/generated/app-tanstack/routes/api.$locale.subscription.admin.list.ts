// AUTO-GENERATED from src/app/api/[locale]/subscription/admin/list/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/subscription/admin/list")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/subscription/admin/list/route"),
    ),
  },
});
