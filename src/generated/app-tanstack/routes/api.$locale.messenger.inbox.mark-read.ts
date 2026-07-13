// AUTO-GENERATED from src/messenger/inbox/mark-read/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/messenger/inbox/mark-read")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/messenger/inbox/mark-read/route"),
    ),
  },
});
