// AUTO-GENERATED from src/app/api/[locale]/agent/claude-code/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/agent/claude-code")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/agent/claude-code/route")) },
});
