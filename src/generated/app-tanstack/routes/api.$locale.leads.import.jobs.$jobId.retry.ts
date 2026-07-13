// AUTO-GENERATED from src/app/api/[locale]/leads/import/jobs/[jobId]/retry/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/leads/import/jobs/$jobId/retry",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/leads/import/jobs/[jobId]/retry/route"),
    ),
  },
});
