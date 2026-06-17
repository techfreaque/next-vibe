// AUTO-GENERATED from src/app/api/[locale]/system/unified-interface/ai/skills/USER_WITH_ACCOUNT_AI_RUN.md/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/unified-interface/ai/skills/USER_WITH_ACCOUNT_AI_RUN/md")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/system/unified-interface/ai/skills/USER_WITH_ACCOUNT_AI_RUN.md/route")) },
});
