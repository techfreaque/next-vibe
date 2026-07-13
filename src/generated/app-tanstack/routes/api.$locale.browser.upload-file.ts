// AUTO-GENERATED from src/browser/upload-file/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/upload-file")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/browser/upload-file/route"),
    ),
  },
});
