// AUTO-GENERATED from src/app/api/[locale]/inventory/stock/adjust/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/inventory/stock/adjust")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/inventory/stock/adjust/route")) },
});
