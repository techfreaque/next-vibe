// AUTO-GENERATED from src/vibe/agent/refusal-index/model/[modelId]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/vibe/agent/refusal-index/model/$modelId",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/vibe/agent/refusal-index/model/[modelId]/route"),
    ),
  },
});
