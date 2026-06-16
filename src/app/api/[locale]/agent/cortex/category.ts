/**
 * Category definition for the Cortex module.
 * Covers AI filesystem: read, write, edit, list, search, exec, and more.
 */

import { AI_STREAM_ALIAS } from "@/app/api/[locale]/agent/ai-stream/stream/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CORTEX_LIST_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "cortex",
  label: {
    "en-US": "Cortex",
    "en-GLOBAL": "Cortex",
    "de-DE": "Cortex",
    "pl-PL": "Cortex",
  },
  group: "ai",
  icon: "brain",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: CORTEX_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: AI_STREAM_ALIAS,
  },
};
