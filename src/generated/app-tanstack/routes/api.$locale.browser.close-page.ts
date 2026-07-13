// AUTO-GENERATED from src/browser/close-page/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/close-page")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/close-page/route"),
    ),
  },
});
