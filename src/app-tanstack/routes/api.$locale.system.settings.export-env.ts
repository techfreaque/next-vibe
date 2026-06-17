// AUTO-GENERATED from src/app/api/[locale]/system/settings/export-env/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/system/settings/export-env")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/system/settings/export-env/route")) },
});
