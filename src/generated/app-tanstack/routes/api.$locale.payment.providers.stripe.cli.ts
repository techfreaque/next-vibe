// AUTO-GENERATED from src/app/api/[locale]/payment/providers/stripe/cli/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/payment/providers/stripe/cli")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/payment/providers/stripe/cli/route")) },
});
