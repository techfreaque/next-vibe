// AUTO-GENERATED from src/app/api/[locale]/browser/fill-form/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/browser/fill-form")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/browser/fill-form/route")) },
});
