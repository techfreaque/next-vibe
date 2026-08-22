// AUTO-GENERATED from src/vibe/execute-tool/await-task/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/execute-tool/await-task",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/execute-tool/await-task/route"),
    ),
  },
});
