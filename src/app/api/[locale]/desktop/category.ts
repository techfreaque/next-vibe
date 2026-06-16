/**
 * Category definition for the Desktop module.
 * Covers window management, interaction, screenshots, and accessibility.
 */

import { DESKTOP_LIST_WINDOWS_ALIAS } from "@/app/api/[locale]/desktop/list-windows/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "desktop",
  label: {
    "en-US": "Desktop",
    "en-GLOBAL": "Desktop",
    "de-DE": "Desktop",
    "pl-PL": "Pulpit",
  },
  group: "platform",
  icon: "monitor",
  order: 30,
  defaultEntry: DESKTOP_LIST_WINDOWS_ALIAS,
  subcategories: {
    Windows: {
      icon: "layout",
      order: 0,
      label: {
        "en-US": "Windows",
        "en-GLOBAL": "Windows",
        "de-DE": "Fenster",
        "pl-PL": "Okna",
      },
      // inherits parent defaultEntry (desktop-list-windows)
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
    },
    Capture: {
      icon: "camera",
      order: 2,
      label: {
        "en-US": "Capture",
        "en-GLOBAL": "Capture",
        "de-DE": "Erfassung",
        "pl-PL": "Przechwytywanie",
      },
    },
    Inspection: {
      icon: "eye",
      order: 3,
      label: {
        "en-US": "Inspection",
        "en-GLOBAL": "Inspection",
        "de-DE": "Inspektion",
        "pl-PL": "Inspekcja",
      },
    },
  },
};
