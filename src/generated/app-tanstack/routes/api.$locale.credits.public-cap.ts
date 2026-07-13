// AUTO-GENERATED from src/app/api/[locale]/credits/public-cap/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/credits/public-cap")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/credits/public-cap/route"),
    ),
  },
});
