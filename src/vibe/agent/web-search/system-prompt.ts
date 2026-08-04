/* eslint-disable i18next/no-literal-string */
import "server-only";

import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import { VibeMode } from "next-vibe/env/env-util";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptFragment } from "../ai-stream/system-prompt/types";
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
    const vibeMode = envClient.NEXT_PUBLIC_VIBE_MODE;

    let hasBrowser = false;
    if (isAdmin) {
      try {
        const { browserEnv } = await import("@/browser/env");
        hasBrowser =
          vibeMode !== VibeMode.CLOUD ||
          browserEnv.CHROME_EXECUTABLE_PATH !== undefined;
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
    } else if (vibeMode === VibeMode.CLOUD) {
      lines.push(`
For JS-heavy sites or interactive pages, the local version of unbottled includes full browser automation.`);
    }

    return lines.join("");
  },
};
