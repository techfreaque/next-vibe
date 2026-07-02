// AUTO-GENERATED from src/app/api/[locale]/agent/chat/folders/subfolders/[subFolderId]/rename/route.ts. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";

import { wrapNextApiRoute } from "../nextjs-compat-wrapper";

export const Route = createFileRoute(
  "/api/$locale/agent/chat/folders/subfolders/$subFolderId/rename",
)({
  server: {
    handlers: wrapNextApiRoute(
      () => import("@/app/api/[locale]/agent/chat/folders/subfolders/[subFolderId]/rename/route"),
    ),
  },
});
