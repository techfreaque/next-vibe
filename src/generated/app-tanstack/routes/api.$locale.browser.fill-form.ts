// AUTO-GENERATED from src/browser/fill-form/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/fill-form")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/fill-form/route"),
    ),
  },
});
