// AUTO-GENERATED from src/app/api/[locale]/messenger/preview/send-test/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/messenger/preview/send-test",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/messenger/preview/send-test/route"),
    ),
  },
});
