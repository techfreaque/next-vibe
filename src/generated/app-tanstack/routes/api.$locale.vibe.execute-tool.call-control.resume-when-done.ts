// AUTO-GENERATED from src/vibe/execute-tool/call-control/resume-when-done/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/execute-tool/call-control/resume-when-done",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/execute-tool/call-control/resume-when-done/route"),
    ),
  },
});
