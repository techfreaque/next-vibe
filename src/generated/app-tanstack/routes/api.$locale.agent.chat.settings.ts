// AUTO-GENERATED from src/app/api/[locale]/agent/chat/settings/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/agent/chat/settings")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("next-vibe/agent/chat/settings/route"),
    ),
  },
});
