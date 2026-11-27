/**
 * Category definition for the User module.
 * Covers authentication, profile, sessions, directory, and remote connections.
 */

import type {
  CategoryDefinition,
  RecordSearchDestination,
} from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";
import { USERS_LIST_ALIAS } from "@/users/list/constants";
import type userDirectory from "@/users/list/definition";
import { USERS_STATS_ALIAS } from "@/users/stats/constants";

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
    "sk-SK": "Účet",
    "hi-IN": "अकाउंट",
  },
  description: {
    "en-US": "Find users and review their account access.",
    "de-DE": "Finden Sie Nutzer und prüfen Sie deren Kontozugriff.",
    "pl-PL": "Odszukaj użytkowników i sprawdź ich dostęp do konta.",
    "fr-FR": "Recherchez des utilisateurs et vérifiez leurs accès.",
    "it-IT":
      "Cerchi gli utenti e verifichi le autorizzazioni sui loro account.",
    "es-ES": "Busque usuarios y revise sus permisos de acceso.",
    "sk-SK":
      "Vyhľadajte používateľov a skontrolujte ich prístupové oprávnenia.",
    "hi-IN": "यूज़र खोजें और उनका अकाउंट एक्सेस देखें।",
    "en-GLOBAL": "Find users and review their account access.",
  },
  group: "people",
  icon: "user",
  order: 10,
  landing: {
    actions: ["users-list", "users-stats"],
  },
  defaultEntry: {
    // Admins land on the signups report; record search goes to users-list.
    [UserPermissionRole.ADMIN]: USERS_STATS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  recordSearch: {
    alias: USERS_LIST_ALIAS,
    field: "search",
  } satisfies RecordSearchDestination<typeof userDirectory.GET>,
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
        "sk-SK": "Prihlásenie a registrácia",
        "hi-IN": "लॉगिन और साइनअप",
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
        "sk-SK": "Profil",
        "hi-IN": "प्रोफ़ाइल",
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
        "sk-SK": "Relácie",
        "hi-IN": "सेशन",
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
        "sk-SK": "Adresár",
        "hi-IN": "डायरेक्टरी",
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
        "sk-SK": "Správa používateľov",
        "hi-IN": "यूज़र मैनेज करें",
      },
    },
    userStats: {
      icon: "bar-chart-2",
      order: 5,
      label: {
        "en-US": "Signups",
        "en-GLOBAL": "Signups",
        "de-DE": "Registrierungen",
        "pl-PL": "Rejestracje",
        "fr-FR": "Inscriptions",
        "it-IT": "Iscrizioni",
        "es-ES": "Registros",
        "sk-SK": "Registrácie",
        "hi-IN": "साइनअप",
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
        "sk-SK": "Vzdialené inštancie",
        "hi-IN": "रिमोट इंस्टेंस",
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
        "sk-SK": "Môj účet",
        "hi-IN": "खुद",
      },
    },
  },
};
