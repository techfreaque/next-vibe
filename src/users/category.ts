import type {
  CategoryDefinition,
  RecordSearchDestination,
} from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { USERS_CREATE_ALIAS } from "./create/constants";
import { USERS_LIST_ALIAS } from "./list/constants";
import type directory from "./list/definition";
import { USERS_STATS_ALIAS } from "./stats/constants";

export const category: CategoryDefinition = {
  key: "usersDirectory",
  group: "people",
  icon: "users",
  order: 5,
  adminPathPrefixes: ["users"],
  label: {
    "en-US": "Users",
    "de-DE": "Nutzer",
    "pl-PL": "Użytkownicy",
    "fr-FR": "Utilisateurs",
    "it-IT": "Utenti",
    "es-ES": "Usuarios",
    "sk-SK": "Používatelia",
    "en-GLOBAL": "Users",
  },
  description: {
    "en-US": "Find people, review access and manage user accounts.",
    "de-DE":
      "Suchen Sie Nutzer und verwalten Sie deren Konten und Zugriffsrechte.",
    "pl-PL": "Wyszukuj użytkowników i zarządzaj ich kontami oraz dostępem.",
    "fr-FR":
      "Recherchez des utilisateurs et gérez leurs comptes et leurs accès.",
    "it-IT": "Cerchi gli utenti e ne gestisca gli account e gli accessi.",
    "es-ES": "Busque usuarios y gestione sus cuentas y permisos.",
    "sk-SK": "Vyhľadajte používateľov a spravujte ich účty a prístupové práva.",
    "en-GLOBAL": "Find people, review access and manage user accounts.",
  },
  landing: {
    summary: { alias: "users-admin-summary", scope: "platform" },
    destinations: [USERS_LIST_ALIAS, USERS_STATS_ALIAS],
    actions: [USERS_CREATE_ALIAS],
  },
  createActions: [USERS_CREATE_ALIAS],
  recordSearch: {
    alias: USERS_LIST_ALIAS,
    field: "search",
  } satisfies RecordSearchDestination<typeof directory.GET>,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: USERS_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {},
};
