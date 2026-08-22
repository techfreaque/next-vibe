// AUTO-GENERATED from src/browser/new-page/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/new-page")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/new-page/route"),
    ),
  },
});
