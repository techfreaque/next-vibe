// AUTO-GENERATED from src/browser/evaluate-script/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/evaluate-script")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/evaluate-script/route"),
    ),
  },
});
