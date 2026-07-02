// AUTO-GENERATED from src/app/api/[locale]/analytics/transformers/script/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/analytics/transformers/script")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/analytics/transformers/script/route")) },
});
