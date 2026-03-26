// AUTO-GENERATED from src/app/api/[locale]/credits/admin-add/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/credits/admin-add")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/credits/admin-add/route")) },
});
