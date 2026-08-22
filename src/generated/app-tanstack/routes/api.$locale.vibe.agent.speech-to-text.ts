// AUTO-GENERATED from src/vibe/agent/speech-to-text/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/vibe/agent/speech-to-text")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/speech-to-text/route"),
    ),
  },
});
