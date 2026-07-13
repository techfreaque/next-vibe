// AUTO-GENERATED from src/app/api/[locale]/manifest/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/manifest")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/manifest/route"),
    ),
  },
});
