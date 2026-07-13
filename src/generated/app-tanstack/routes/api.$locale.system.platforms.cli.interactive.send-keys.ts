// AUTO-GENERATED from src/vibe/platforms/cli/interactive/send-keys/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/platforms/cli/interactive/send-keys",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/platforms/cli/interactive/send-keys/route"),
    ),
  },
});
