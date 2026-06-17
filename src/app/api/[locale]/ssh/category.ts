/**
 * Category definition for the SSH/Infrastructure module.
 * Covers connections, browser terminal, and Linux user management.
 * Command execution and file access now live in cortex (cortex-exec, cortex-list/read).
 */

import { SSH_CONNECTIONS_LIST_ALIAS } from "@/app/api/[locale]/ssh/connections/list/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "ssh",
  label: {
    "en-US": "SSH & Infra",
    "en-GLOBAL": "SSH & Infra",
    "de-DE": "SSH & Infra",
    "pl-PL": "SSH i Infra",
  },
  group: "platform",
  icon: "terminal",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SSH_CONNECTIONS_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: SSH_CONNECTIONS_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Connections: {
      icon: "link-2",
      order: 0,
      label: {
        "en-US": "Connections",
        "en-GLOBAL": "Connections",
        "de-DE": "Verbindungen",
        "pl-PL": "Połączenia",
      },
    },
    Linux: {
      icon: "user",
      order: 1,
      label: {
        "en-US": "Linux Users",
        "en-GLOBAL": "Linux Users",
        "de-DE": "Linux-Benutzer",
        "pl-PL": "Użytkownicy Linux",
      },
    },
  },
};
