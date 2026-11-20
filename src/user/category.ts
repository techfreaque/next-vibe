/**
 * Category definition for the User module.
 * Covers authentication, profile, sessions, directory, and remote connections.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "account",
  label: {
    "en-US": "Account",
    "en-GLOBAL": "Account",
    "de-DE": "Konto",
    "pl-PL": "Konto",
    "fr-FR": "Compte",
    "it-IT": "Account",
    "es-ES": "Cuenta",
  },
  group: "system",
  icon: "user",
  order: 10,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: USER_ME_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    login: {
      icon: "log-in",
      order: 0,
      label: {
        "en-US": "Login & Signup",
        "en-GLOBAL": "Login & Signup",
        "de-DE": "Login & Registrierung",
        "pl-PL": "Logowanie i rejestracja",
        "fr-FR": "Connexion et inscription",
        "it-IT": "Accesso e registrazione",
        "es-ES": "Acceso y registro",
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
        "fr-FR": "Profil",
        "it-IT": "Profilo",
        "es-ES": "Perfil",
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
        "fr-FR": "Sessions",
        "it-IT": "Sessioni",
        "es-ES": "Sesiones",
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
        "fr-FR": "Annuaire",
        "it-IT": "Elenco",
        "es-ES": "Directorio",
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
        "fr-FR": "Gérer les utilisateurs",
        "it-IT": "Gestione utenti",
        "es-ES": "Gestión de usuarios",
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
        "fr-FR": "Stats des utilisateurs",
        "it-IT": "Statistiche utenti",
        "es-ES": "Estadísticas de usuarios",
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
        "fr-FR": "Instances distantes",
        "it-IT": "Istanze remote",
        "es-ES": "Instancias remotas",
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
        "fr-FR": "Instance locale",
        "it-IT": "Il mio account",
        "es-ES": "Mi cuenta",
      },
    },
  },
};
