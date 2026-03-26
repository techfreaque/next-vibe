// AUTO-GENERATED from src/app/api/[locale]/ssh/terminal/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/ssh/terminal")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/ssh/terminal/route")) },
});
