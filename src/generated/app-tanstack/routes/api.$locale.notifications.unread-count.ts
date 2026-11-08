// AUTO-GENERATED from src/notifications/unread-count/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/notifications/unread-count")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/notifications/unread-count/route"),
      ),
    },
  },
);
