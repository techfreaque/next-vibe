// AUTO-GENERATED from src/app/api/[locale]/agent/chat/data-sources/chat-tool-calls-total/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/agent/chat/data-sources/chat-tool-calls-total",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/app/api/[locale]/agent/chat/data-sources/chat-tool-calls-total/route"),
    ),
  },
});
