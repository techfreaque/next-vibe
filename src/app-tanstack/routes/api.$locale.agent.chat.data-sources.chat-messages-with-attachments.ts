// AUTO-GENERATED from src/app/api/[locale]/agent/chat/data-sources/chat-messages-with-attachments/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { wrapNextApiRoute } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

export const Route = createFileRoute("/api/$locale/agent/chat/data-sources/chat-messages-with-attachments")({
  server: { handlers: wrapNextApiRoute(() => import("@/app/api/[locale]/agent/chat/data-sources/chat-messages-with-attachments/route")) },
});
