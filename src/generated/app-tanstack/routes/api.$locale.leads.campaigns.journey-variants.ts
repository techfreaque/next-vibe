// AUTO-GENERATED from src/app/api/[locale]/leads/campaigns/journey-variants/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/leads/campaigns/journey-variants")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/leads/campaigns/journey-variants/route")) },
});
