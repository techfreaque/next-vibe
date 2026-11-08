// AUTO-GENERATED from src/user/private/me/two-factor/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/private/me/two-factor")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/user/private/me/two-factor/route"),
      ),
    },
  },
);
