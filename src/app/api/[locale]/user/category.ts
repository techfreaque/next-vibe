/**
 * Category definition for the User module.
 * Covers authentication, profile, sessions, directory, and remote connections.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "account",
  label: {
    "en-US": "Account",
    "en-GLOBAL": "Account",
    "de-DE": "Konto",
    "pl-PL": "Konto",
  },
  group: "system",
  icon: "user",
  order: 10,
  defaultEntry: USER_ME_ALIAS,
  subcategories: {
    login: {
      icon: "log-in",
      order: 0,
      label: {
        "en-US": "Login & Signup",
        "en-GLOBAL": "Login & Signup",
        "de-DE": "Login & Registrierung",
        "pl-PL": "Logowanie i rejestracja",
      },
    },
    profile: {
      icon: "user",
      order: 1,
      label: {
        "en-US": "Profile",
        "en-GLOBAL": "Profile",
        "de-DE": "Profil",
        "pl-PL": "Profil",
      },
    },
    sessions: {
      icon: "activity",
      order: 2,
      label: {
        "en-US": "Sessions",
        "en-GLOBAL": "Sessions",
        "de-DE": "Sitzungen",
        "pl-PL": "Sesje",
      },
    },
    directory: {
      icon: "book",
      order: 3,
      label: {
        "en-US": "Directory",
        "en-GLOBAL": "Directory",
        "de-DE": "Verzeichnis",
        "pl-PL": "Katalog",
      },
    },
    manageUsers: {
      icon: "users",
      order: 4,
      label: {
        "en-US": "Manage Users",
        "en-GLOBAL": "Manage Users",
        "de-DE": "Nutzer verwalten",
        "pl-PL": "Zarządzaj użytkownikami",
      },
    },
    userStats: {
      icon: "bar-chart-2",
      order: 5,
      label: {
        "en-US": "User Stats",
        "en-GLOBAL": "User Stats",
        "de-DE": "Nutzerstatistiken",
        "pl-PL": "Statystyki użytkowników",
      },
    },
    remoteInstances: {
      icon: "link-2",
      order: 6,
      label: {
        "en-US": "Remote Instances",
        "en-GLOBAL": "Remote Instances",
        "de-DE": "Remote-Instanzen",
        "pl-PL": "Zdalne instancje",
      },
    },
    remoteSelf: {
      icon: "globe",
      order: 7,
      label: {
        "en-US": "Self",
        "en-GLOBAL": "Self",
        "de-DE": "Eigene Instanz",
        "pl-PL": "Własna instancja",
      },
    },
  },
};
