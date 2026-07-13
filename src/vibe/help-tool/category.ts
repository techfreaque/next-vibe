/**
 * Category definition for the System module.
 * Covers code generation, build tools, quality checks, server management, and tasks.
 */

import { SYSTEM_SETTINGS_ALIAS } from "next-vibe/env/settings/constants";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import type { CategoryDefinition } from "./category-types";

export const category: CategoryDefinition = {
  key: "devTools",
  label: {
    "en-US": "System",
    "en-GLOBAL": "System",
    "de-DE": "System",
    "pl-PL": "System",
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
      },
    },
  },
};
