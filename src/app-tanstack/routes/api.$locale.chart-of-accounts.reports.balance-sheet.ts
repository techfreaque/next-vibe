// AUTO-GENERATED from src/app/api/[locale]/chart-of-accounts/reports/balance-sheet/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/chart-of-accounts/reports/balance-sheet")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/chart-of-accounts/reports/balance-sheet/route")) },
});
