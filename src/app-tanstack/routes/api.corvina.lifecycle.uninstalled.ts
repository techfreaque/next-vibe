import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/corvina/lifecycle/uninstalled")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/corvina/lifecycle/uninstalled/route")) },
});
