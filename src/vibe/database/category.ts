/**
 * Category definition for the Database module.
 * Covers schema migrations, SQL execution, seeding, and DB tooling.
 */

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import type { CategoryDefinition } from "../help-tool/category-types";
import { UserPermissionRole } from "../identity/roles/enum";
import { SQL_ALIAS } from "./sql/constants";

export const category: CategoryDefinition = {
  key: "database",
  label: {
    "en-US": "Database",
    "en-GLOBAL": "Database",
    "de-DE": "Datenbank",
    "pl-PL": "Baza danych",
    "fr-FR": "Base de données",
    "it-IT": "Database",
    "es-ES": "Base de datos",
    "sk-SK": "Databáza",
    "hi-IN": "डेटाबेस",
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
        "fr-FR": "Migrations",
        "it-IT": "Migrazioni",
        "es-ES": "Migraciones",
        "sk-SK": "Migrácie",
        "hi-IN": "माइग्रेशन",
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
        "fr-FR": "Outils",
        "it-IT": "Strumenti",
        "es-ES": "Herramientas",
        "sk-SK": "Nástroje",
        "hi-IN": "टूल",
      },
    },
  },
};
