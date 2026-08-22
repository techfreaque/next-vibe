// AUTO-GENERATED from src/vibe/platforms/ai/skills/[characterSkill]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/platforms/ai/skills/$characterSkill",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/platforms/ai/skills/[characterSkill]/route"),
    ),
  },
});
