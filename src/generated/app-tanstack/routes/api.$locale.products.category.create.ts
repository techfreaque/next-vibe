// AUTO-GENERATED from src/app/api/[locale]/products/category/create/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/products/category/create")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/products/category/create/route")) },
});
