// AUTO-GENERATED from src/browser/list-pages/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/list-pages")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/list-pages/route"),
    ),
  },
});
