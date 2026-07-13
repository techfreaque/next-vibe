// AUTO-GENERATED from src/app/api/[locale]/contact/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/contact")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/contact/route"),
    ),
  },
});
