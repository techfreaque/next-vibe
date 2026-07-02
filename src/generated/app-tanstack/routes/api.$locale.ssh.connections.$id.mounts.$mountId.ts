// AUTO-GENERATED from src/app/api/[locale]/ssh/connections/[id]/mounts/[mountId]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/ssh/connections/$id/mounts/$mountId")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/ssh/connections/[id]/mounts/[mountId]/route")) },
});
