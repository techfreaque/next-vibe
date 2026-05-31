/**
 * Category definition for the System module.
 * Covers code generation, build tools, quality checks, server management, and tasks.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { HEALTH_ALIAS } from "@/app/api/[locale]/system/server/health/constants";
import { BUILDER_ALIAS } from "@/app/api/[locale]/system/builder/constants";
import { DEV_ALIASES } from "@/app/api/[locale]/system/server/dev/constants";
import { VIBE_CHECK_ALIAS } from "@/app/api/[locale]/system/check/vibe-check/constants";
import { GUARD_STATUS_ALIAS } from "@/app/api/[locale]/system/guard/status/constants";
import { ELECTRON_ALIAS } from "@/app/api/[locale]/system/server/electron/start/constants";
import { SYSTEM_SETTINGS_ALIAS } from "@/app/api/[locale]/system/settings/constants";
import { CLI_STATUS_ALIAS } from "@/app/api/[locale]/system/unified-interface/cli/setup/status/constants";
import { MCP_ALIAS } from "@/app/api/[locale]/system/unified-interface/mcp/serve/constants";
import { VIBE_FRAME_MOUNT_ALIAS } from "@/app/api/[locale]/system/unified-interface/vibe-frame/mount/constants";
import { CRON_LIST_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/constants";
import { ERROR_LOGS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/error-monitor/logs/constants";
import { PULSE_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/history/constants";
import { REMOTE_SYNC_ALIAS } from "@/app/api/[locale]/remote-connection/sync/constants";

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
  defaultEntry: HEALTH_ALIAS,
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
      defaultEntry: BUILDER_ALIAS,
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
      defaultEntry: DEV_ALIASES[0],
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
      defaultEntry: VIBE_CHECK_ALIAS,
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
      // inherits parent defaultEntry (health)
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
      defaultEntry: GUARD_STATUS_ALIAS,
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
      defaultEntry: ELECTRON_ALIAS,
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
      defaultEntry: SYSTEM_SETTINGS_ALIAS,
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
      defaultEntry: CLI_STATUS_ALIAS,
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
      defaultEntry: MCP_ALIAS,
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
      defaultEntry: VIBE_FRAME_MOUNT_ALIAS,
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
      defaultEntry: CRON_LIST_ALIAS,
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
      defaultEntry: ERROR_LOGS_ALIAS,
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
      defaultEntry: PULSE_HISTORY_ALIAS,
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
      defaultEntry: REMOTE_SYNC_ALIAS,
    },
  },
};
