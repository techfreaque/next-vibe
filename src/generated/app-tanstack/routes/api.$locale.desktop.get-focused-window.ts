// AUTO-GENERATED from src/desktop/get-focused-window/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/desktop/get-focused-window")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/desktop/get-focused-window/route"),
      ),
    },
  },
);
