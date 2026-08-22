// AUTO-GENERATED from src/browser/take-screenshot/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/take-screenshot")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/take-screenshot/route"),
    ),
  },
});
