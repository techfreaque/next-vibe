/**
 * Category definition for the Finance module.
 * Revenue vs upstream cost monitoring: margin, provider balances, alerts.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { FINANCE_STATUS_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "finance",
  label: {
    "en-US": "Finance",
    "en-GLOBAL": "Finance",
    "de-DE": "Finanzen",
    "pl-PL": "Finanse",
  },
  group: "business",
  icon: "wallet",
  order: 66,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: FINANCE_STATUS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Monitoring: {
      icon: "activity",
      order: 0,
      label: {
        "en-US": "Monitoring",
        "en-GLOBAL": "Monitoring",
        "de-DE": "Überwachung",
        "pl-PL": "Monitoring",
      },
    },
  },
};
