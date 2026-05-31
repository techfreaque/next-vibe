/**
 * Category definition for the Browser module.
 * Covers page navigation, interaction, inspection, and DevTools.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { BROWSER_NEW_PAGE_ALIAS } from "@/app/api/[locale]/browser/new-page/constants";
import { BROWSER_CLICK_ALIAS } from "@/app/api/[locale]/browser/click/constants";
import { BROWSER_SCREENSHOT_ALIAS } from "@/app/api/[locale]/browser/take-screenshot/constants";
import { BROWSER_EVAL_ALIAS } from "@/app/api/[locale]/browser/evaluate-script/constants";

export const category: CategoryDefinition = {
  key: "browser",
  label: {
    "en-US": "Browser",
    "en-GLOBAL": "Browser",
    "de-DE": "Browser",
    "pl-PL": "Przeglądarka",
  },
  group: "platform",
  icon: "globe",
  order: 10,
  defaultEntry: BROWSER_NEW_PAGE_ALIAS,
  subcategories: {
    Pages: {
      icon: "layout",
      order: 0,
      label: {
        "en-US": "Pages",
        "en-GLOBAL": "Pages",
        "de-DE": "Seiten",
        "pl-PL": "Strony",
      },
      // inherits parent defaultEntry (browser-new-page)
    },
    Interaction: {
      icon: "mouse-pointer",
      order: 1,
      label: {
        "en-US": "Interaction",
        "en-GLOBAL": "Interaction",
        "de-DE": "Interaktion",
        "pl-PL": "Interakcja",
      },
      defaultEntry: BROWSER_CLICK_ALIAS,
    },
    Inspection: {
      icon: "camera",
      order: 2,
      label: {
        "en-US": "Inspection",
        "en-GLOBAL": "Inspection",
        "de-DE": "Inspektion",
        "pl-PL": "Inspekcja",
      },
      defaultEntry: BROWSER_SCREENSHOT_ALIAS,
    },
    DevTools: {
      icon: "terminal",
      order: 3,
      label: {
        "en-US": "DevTools",
        "en-GLOBAL": "DevTools",
        "de-DE": "Entwicklertools",
        "pl-PL": "Narzędzia Dev",
      },
      defaultEntry: BROWSER_EVAL_ALIAS,
    },
  },
};
