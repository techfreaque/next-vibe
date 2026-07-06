// AUTO-GENERATED from src/app/api/[locale]/agent/chat/data-sources/chat-unique-users/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/agent/chat/data-sources/chat-unique-users",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/app/api/[locale]/agent/chat/data-sources/chat-unique-users/route"),
    ),
  },
});
