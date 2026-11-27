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
    "hi-IN": "यूज़र",
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
    "hi-IN": "लोग खोजें, एक्सेस देखें और यूज़र अकाउंट मैनेज करें।",
    "en-GLOBAL": "Find people, review access and manage user accounts.",
  },
  landing: {
    summary: { alias: "users-admin-summary", scope: "platform" },
    destinations: [USERS_LIST_ALIAS, USERS_STATS_ALIAS],
    actions: [USERS_CREATE_ALIAS],
    destinationDescriptions: {
      "users-list": {
        "en-US":
          "Every account with what it paid, spends and when it was last active.",
        "en-GLOBAL":
          "Every account with what it paid, spends and when it was last active.",
        "de-DE": "Alle Konten mit Zahlungen, Verbrauch und letzter Aktivität.",
        "pl-PL": "Każde konto z wpłatami, wydatkami i ostatnią aktywnością.",
        "fr-FR":
          "Chaque compte avec ses paiements, sa consommation et sa dernière activité.",
        "it-IT": "Ogni account con pagamenti, consumi e ultima attività.",
        "es-ES":
          "Cada cuenta con lo que pagó, lo que gasta y su última actividad.",
        "sk-SK": "Každý účet s platbami, spotrebou a poslednou aktivitou.",
        "hi-IN": "हर अकाउंट, उसका पेमेंट, खर्च और आखिरी बार एक्टिव होने का समय।",
      },
      "users-stats": {
        "en-US": "Who signed up, from where, and who stayed and paid.",
        "en-GLOBAL": "Who signed up, from where, and who stayed and paid.",
        "de-DE":
          "Wer sich angemeldet hat, woher, und wer geblieben ist und zahlt.",
        "pl-PL": "Kto się zarejestrował, skąd, kto został i kto zapłacił.",
        "fr-FR": "Qui s’est inscrit, d’où, et qui est resté et a payé.",
        "it-IT": "Chi si è iscritto, da dove, e chi è rimasto e ha pagato.",
        "es-ES": "Quién se registró, desde dónde, y quién se quedó y pagó.",
        "sk-SK": "Kto sa zaregistroval, odkiaľ a kto zostal a zaplatil.",
        "hi-IN": "किसने साइन अप किया, कहाँ से, और कौन रुका और पेमेंट किया।",
      },
    },
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
