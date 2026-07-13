// AUTO-GENERATED from src/vibe/platforms/cli/setup/uninstall/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/platforms/cli/setup/uninstall",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/platforms/cli/setup/uninstall/route"),
    ),
  },
});
