// AUTO-GENERATED from src/app/api/[locale]/system/platforms/ai/skills/USER_WITH_ACCOUNT_SKILL.md/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/platforms/ai/skills/USER_WITH_ACCOUNT_SKILL/md")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/system/platforms/ai/skills/USER_WITH_ACCOUNT_SKILL.md/route")) },
});
