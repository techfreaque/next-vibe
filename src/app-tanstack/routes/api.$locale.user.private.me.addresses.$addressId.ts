// AUTO-GENERATED from src/app/api/[locale]/user/private/me/addresses/[addressId]/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/user/private/me/addresses/$addressId",
)({
  server: {
    handlers: wrapNextApiRoute(
      () =>
        import("@/app/api/[locale]/user/private/me/addresses/[addressId]/route"),
    ),
  },
});
