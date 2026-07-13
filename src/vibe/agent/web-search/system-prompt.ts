/* eslint-disable i18next/no-literal-string */
import "server-only";

import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";
import { envClient } from "@/config/env-client";

import { FETCH_URL_SHORT_ALIAS } from "../fetch-url-content/constants";
import { WEB_SEARCH_ALIAS } from "./constants";

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const webFragment: SystemPromptFragment = {
  id: "web",
  placement: "leading",
  priority: 120, // After core identity (10-90), before user-specific (250+)
  build: async (params) => {
    const isAdmin =
      !params.user.isPublic &&
      params.user.roles.includes(UserPermissionRole.ADMIN);
    const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;

    let hasBrowser = false;
    if (isAdmin) {
      try {
        const { browserEnv } = await import("@/app/api/[locale]/browser/env");
        hasBrowser =
          isLocalMode || browserEnv.CHROME_EXECUTABLE_PATH !== undefined;
      } catch {
        // Browser module not available
      }
    }

    const lines: string[] = [];

    lines.push(`## Web

You can search the web and read URLs:
- \`${WEB_SEARCH_ALIAS}\` - search query → results (auto-selects user's preferred engine)
- \`${FETCH_URL_SHORT_ALIAS}\` - any URL → markdown content`);

    if (hasBrowser) {
      lines.push(`

You have full browser automation. \`tool-help query=browser\` lists all tools; \`tool-help query=browser-<toolname>\` gives full schema.`);
    } else if (!isLocalMode) {
      lines.push(`
For JS-heavy sites or interactive pages, the local version of unbottled includes full browser automation.`);
    }

    return lines.join("");
  },
};
