/**
 * Category definition for the Cortex module.
 * Covers AI filesystem: read, write, edit, list, search, exec, and more.
 */

import { AI_STREAM_ALIAS } from "../ai-stream/stream/constants";
import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

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
