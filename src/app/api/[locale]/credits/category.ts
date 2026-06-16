/**
 * Category definition for the Credits module.
 * Covers credit balance, history, purchases, grants, and admin operations.
 */

import { CREDITS_ALIAS } from "@/app/api/[locale]/credits/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "credits",
  label: {
    "en-US": "Credits",
    "en-GLOBAL": "Credits",
    "de-DE": "Guthaben",
    "pl-PL": "Środki",
  },
  group: "business",
  icon: "coins",
  order: 15,
  defaultEntry: CREDITS_ALIAS,
  subcategories: {
    Credits: {
      icon: "coins",
      order: 0,
      label: {
        "en-US": "Credits",
        "en-GLOBAL": "Credits",
        "de-DE": "Guthaben",
        "pl-PL": "Środki",
      },
      // inherits parent defaultEntry (credits-balance)
    },
    Management: {
      icon: "shield",
      order: 1,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
      },
    },
  },
};
