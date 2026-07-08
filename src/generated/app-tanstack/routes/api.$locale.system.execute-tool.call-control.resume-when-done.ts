// AUTO-GENERATED from src/app/api/[locale]/system/execute-tool/call-control/resume-when-done/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/system/execute-tool/call-control/resume-when-done",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/app/api/[locale]/system/execute-tool/call-control/resume-when-done/route"),
    ),
  },
});
