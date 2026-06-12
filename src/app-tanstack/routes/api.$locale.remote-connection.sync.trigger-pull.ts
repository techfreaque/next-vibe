// AUTO-GENERATED from src/app/api/[locale]/remote-connection/sync/trigger-pull/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/remote-connection/sync/trigger-pull")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/remote-connection/sync/trigger-pull/route")) },
});
