// AUTO-GENERATED from src/finance/credit-liabilities/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/finance/credit-liabilities")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/finance/credit-liabilities/route"),
      ),
    },
  },
);
