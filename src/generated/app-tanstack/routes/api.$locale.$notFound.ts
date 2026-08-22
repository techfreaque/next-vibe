// AUTO-GENERATED from src/[...notFound]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/$notFound")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/[...notFound]/route"),
    ),
  },
});
