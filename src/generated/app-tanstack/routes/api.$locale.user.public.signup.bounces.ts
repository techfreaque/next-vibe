// AUTO-GENERATED from src/user/public/signup/bounces/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/user/public/signup/bounces")(
  {
    server: {
      handlers: wrapNextApiRoute(
        () => import("@/user/public/signup/bounces/route"),
      ),
    },
  },
);
