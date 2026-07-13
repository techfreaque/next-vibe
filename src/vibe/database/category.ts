/**
 * Category definition for the Database module.
 * Covers schema migrations, SQL execution, seeding, and DB tooling.
 */

import { SQL_ALIAS } from "next-vibe/database/sql/constants";
import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "database",
  label: {
    "en-US": "Database",
    "en-GLOBAL": "Database",
    "de-DE": "Datenbank",
    "pl-PL": "Baza danych",
  },
  group: "system",
  icon: "database",
  order: 30,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SQL_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Migrations: {
      icon: "file-plus",
      order: 0,
      label: {
        "en-US": "Migrations",
        "en-GLOBAL": "Migrations",
        "de-DE": "Migrationen",
        "pl-PL": "Migracje",
      },
    },
    Tools: {
      icon: "wrench",
      order: 1,
      label: {
        "en-US": "Tools",
        "en-GLOBAL": "Tools",
        "de-DE": "Werkzeuge",
        "pl-PL": "Narzędzia",
      },
    },
  },
};
