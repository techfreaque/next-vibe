/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import { FETCH_URL_SHORT_ALIAS } from "../../fetch-url-content/constants";
import { WEB_SEARCH_ALIAS } from "../web-search/constants";

export interface WebData {
  /** Whether the user has browser automation available (admin + local/chrome configured) */
  hasBrowser: boolean;
  /** Whether the user is on the cloud version (show local CTA) */
  isCloud: boolean;
}

export const webFragment: SystemPromptFragment<WebData> = {
  id: "web",
  placement: "leading",
  priority: 120, // After core identity (10-90), before user-specific (250+)
  build: (data) => {
    const lines: string[] = [];

    lines.push(`## Web

You can search the web and read URLs:
- \`${WEB_SEARCH_ALIAS}\` - search query → results (auto-selects user's preferred engine)
- \`${FETCH_URL_SHORT_ALIAS}\` - any URL → markdown content`);

    if (data.hasBrowser) {
      lines.push(`
You have full browser automation: navigate pages, click, fill forms, take screenshots, extract data from JS-heavy sites.
Use \`tool-help --query browser\` to discover all browser tools.`);
    } else if (data.isCloud) {
      lines.push(`
For JS-heavy sites or interactive pages, the local version of unbottled includes full browser automation.`);
    }

    return lines.join("");
  },
};
