// AUTO-GENERATED from src/_pages/_root/llms-full.txt/root-route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/_pages/_root/llms-full.txt/root-route"),
    ),
  },
});
