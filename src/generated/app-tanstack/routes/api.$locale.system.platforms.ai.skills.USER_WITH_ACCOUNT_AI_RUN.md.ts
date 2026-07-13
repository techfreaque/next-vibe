// AUTO-GENERATED from src/vibe/platforms/ai/skills/USER_WITH_ACCOUNT_AI_RUN.md/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/platforms/ai/skills/USER_WITH_ACCOUNT_AI_RUN/md",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("next-vibe/platforms/ai/skills/USER_WITH_ACCOUNT_AI_RUN.md/route"),
    ),
  },
});
