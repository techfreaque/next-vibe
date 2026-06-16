/**
 * Category definition for the Companies module.
 * Covers company profiles, onboarding, and member management.
 */

import { COMPANIES_LIST_ALIAS } from "@/app/api/[locale]/companies/list/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "companies",
  label: {
    "en-US": "Companies",
    "en-GLOBAL": "Companies",
    "de-DE": "Unternehmen",
    "pl-PL": "Firmy",
  },
  group: "business",
  icon: "building",
  order: 35,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: COMPANIES_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: COMPANIES_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Company Management": {
      icon: "building",
      order: 0,
      label: {
        "en-US": "Companies",
        "en-GLOBAL": "Companies",
        "de-DE": "Unternehmen",
        "pl-PL": "Firmy",
      },
      // inherits parent defaultEntry (companies-list)
    },
    "Company Members": {
      icon: "user-plus",
      order: 1,
      label: {
        "en-US": "Members",
        "en-GLOBAL": "Members",
        "de-DE": "Mitglieder",
        "pl-PL": "Członkowie",
      },
    },
  },
};
