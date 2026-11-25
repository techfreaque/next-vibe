// AUTO-GENERATED from src/seo/indexnow/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/seo/indexnow")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/seo/indexnow/route"),
    ),
  },
});
