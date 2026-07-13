// AUTO-GENERATED from src/ssh/linux/users/[username]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/ssh/linux/users/$username")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/ssh/linux/users/[username]/route"),
    ),
  },
});
