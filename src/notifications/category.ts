/**
 * Category definition for the Notifications module.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { NOTIFICATIONS_LIST_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "notifications",
  label: {
    "en-US": "Notifications",
    "en-GLOBAL": "Notifications",
    "de-DE": "Benachrichtigungen",
    "pl-PL": "Powiadomienia",
  },
  group: "business",
  icon: "bell",
  order: 70,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: NOTIFICATIONS_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: NOTIFICATIONS_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: NOTIFICATIONS_LIST_ALIAS,
  },
  subcategories: {},
};
