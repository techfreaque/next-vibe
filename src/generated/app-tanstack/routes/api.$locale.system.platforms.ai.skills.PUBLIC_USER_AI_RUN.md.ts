// AUTO-GENERATED from src/app/api/[locale]/system/platforms/ai/skills/PUBLIC_USER_AI_RUN.md/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/platforms/ai/skills/PUBLIC_USER_AI_RUN/md",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/system/platforms/ai/skills/PUBLIC_USER_AI_RUN.md/route"),
    ),
  },
});
