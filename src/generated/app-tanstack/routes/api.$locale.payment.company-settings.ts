// AUTO-GENERATED from src/payment/company-settings/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/company-settings")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/payment/company-settings/route"),
    ),
  },
});
