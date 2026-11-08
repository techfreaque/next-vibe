// AUTO-GENERATED from src/messenger/system-mailbox/inbox/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/messenger/system-mailbox/inbox",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/messenger/system-mailbox/inbox/route"),
    ),
  },
});
