// AUTO-GENERATED from src/seo/summary/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/seo/summary")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/seo/summary/route"),
    ),
  },
});
