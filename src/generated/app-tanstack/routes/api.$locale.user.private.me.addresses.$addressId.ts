// AUTO-GENERATED from src/user/private/me/addresses/[addressId]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/user/private/me/addresses/$addressId",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/user/private/me/addresses/[addressId]/route"),
    ),
  },
});
