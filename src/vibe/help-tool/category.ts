/**
 * Category definition for the System module.
 * Covers code generation, build tools, quality checks, server management, and tasks.
 */

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { SYSTEM_SETTINGS_ALIAS } from "../env/settings/constants";
import { UserPermissionRole } from "../identity/roles/enum";
import type { CategoryDefinition } from "./category-types";

export const category: CategoryDefinition = {
  key: "devTools",
  label: {
    "en-US": "System",
    "en-GLOBAL": "System",
    "de-DE": "System",
    "pl-PL": "System",
    "fr-FR": "Système",
    "it-IT": "Sistema",
    "es-ES": "Sistema",
  },
  group: "system",
  icon: "settings",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SYSTEM_SETTINGS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Generators: {
      icon: "code-2",
      order: 0,
      label: {
        "en-US": "Generators",
        "en-GLOBAL": "Generators",
        "de-DE": "Generatoren",
        "pl-PL": "Generatory",
        "fr-FR": "Générateurs",
        "it-IT": "Generatori",
        "es-ES": "Generadores",
      },
    },
    Build: {
      icon: "zap",
      order: 1,
      label: {
        "en-US": "Build",
        "en-GLOBAL": "Build",
        "de-DE": "Build",
        "pl-PL": "Kompilacja",
        "fr-FR": "Build",
        "it-IT": "Compilazione",
        "es-ES": "Compilación",
      },
    },
    Check: {
      icon: "check-circle",
      order: 2,
      label: {
        "en-US": "Check",
        "en-GLOBAL": "Check",
        "de-DE": "Prüfen",
        "pl-PL": "Sprawdź",
        "fr-FR": "Vérification",
        "it-IT": "Verifica",
        "es-ES": "Verificación",
      },
    },
    serverManagement: {
      icon: "server",
      order: 3,
      label: {
        "en-US": "Server",
        "en-GLOBAL": "Server",
        "de-DE": "Server",
        "pl-PL": "Serwer",
        "fr-FR": "Serveur",
        "it-IT": "Server",
        "es-ES": "Servidor",
      },
    },
    serverGuard: {
      icon: "shield",
      order: 4,
      label: {
        "en-US": "Guard",
        "en-GLOBAL": "Guard",
        "de-DE": "Guard",
        "pl-PL": "Guard",
        "fr-FR": "Guard",
        "it-IT": "Protezione",
        "es-ES": "Protección",
      },
    },
    serverElectron: {
      icon: "monitor",
      order: 5,
      label: {
        "en-US": "Electron",
        "en-GLOBAL": "Electron",
        "de-DE": "Electron",
        "pl-PL": "Electron",
        "fr-FR": "Electron",
        "it-IT": "Electron",
        "es-ES": "Electron",
      },
    },
    settingsEnv: {
      icon: "sliders",
      order: 6,
      label: {
        "en-US": "Settings",
        "en-GLOBAL": "Settings",
        "de-DE": "Einstellungen",
        "pl-PL": "Ustawienia",
        "fr-FR": "Paramètres",
        "it-IT": "Impostazioni",
        "es-ES": "Configuración",
      },
    },
    settingsKeys: {
      icon: "key",
      order: 7,
      label: {
        "en-US": "Keys",
        "en-GLOBAL": "Keys",
        "de-DE": "Schlüssel",
        "pl-PL": "Klucze",
        "fr-FR": "Clés",
        "it-IT": "Chiavi",
        "es-ES": "Claves",
      },
    },
    interfacesCli: {
      icon: "terminal",
      order: 8,
      label: {
        "en-US": "CLI",
        "en-GLOBAL": "CLI",
        "de-DE": "CLI",
        "pl-PL": "CLI",
        "fr-FR": "CLI",
        "it-IT": "CLI",
        "es-ES": "CLI",
      },
    },
    interfacesMcp: {
      icon: "cpu",
      order: 9,
      label: {
        "en-US": "MCP",
        "en-GLOBAL": "MCP",
        "de-DE": "MCP",
        "pl-PL": "MCP",
        "fr-FR": "MCP",
        "it-IT": "MCP",
        "es-ES": "MCP",
      },
    },
    interfacesFrame: {
      icon: "layout",
      order: 10,
      label: {
        "en-US": "Frame",
        "en-GLOBAL": "Frame",
        "de-DE": "Frame",
        "pl-PL": "Frame",
        "fr-FR": "Frame",
        "it-IT": "Frame",
        "es-ES": "Frame",
      },
    },
    tasksCron: {
      icon: "clock",
      order: 11,
      label: {
        "en-US": "Cron Tasks",
        "en-GLOBAL": "Cron Tasks",
        "de-DE": "Cron-Aufgaben",
        "pl-PL": "Zadania cron",
        "fr-FR": "Tâches cron",
        "it-IT": "Attività cron",
        "es-ES": "Tareas cron",
      },
    },
    tasksMonitoring: {
      icon: "activity",
      order: 12,
      label: {
        "en-US": "Monitoring",
        "en-GLOBAL": "Monitoring",
        "de-DE": "Überwachung",
        "pl-PL": "Monitoring",
        "fr-FR": "Monitoring",
        "it-IT": "Monitoraggio",
        "es-ES": "Monitoreo",
      },
    },
    tasksPulse: {
      icon: "radio",
      order: 13,
      label: {
        "en-US": "Pulse",
        "en-GLOBAL": "Pulse",
        "de-DE": "Pulse",
        "pl-PL": "Puls",
        "fr-FR": "Pulse",
        "it-IT": "Pulse",
        "es-ES": "Pulse",
      },
    },
    tasksSync: {
      icon: "refresh-cw",
      order: 14,
      label: {
        "en-US": "Sync",
        "en-GLOBAL": "Sync",
        "de-DE": "Synchronisierung",
        "pl-PL": "Synchronizacja",
        "fr-FR": "Synchronisation",
        "it-IT": "Sincronizzazione",
        "es-ES": "Sincronización",
      },
    },
  },
};
