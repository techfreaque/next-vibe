// AUTO-GENERATED from src/payment/invoice/recurring/[scheduleId]/toggle/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/payment/invoice/recurring/$scheduleId/toggle",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/invoice/recurring/[scheduleId]/toggle/route"),
    ),
  },
});
