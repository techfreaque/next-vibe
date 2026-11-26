import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "serviceHealth",
  label: {
    "en-US": "System health",
    "de-DE": "Systemzustand",
    "pl-PL": "Stan systemu",
    "fr-FR": "État du système",
    "it-IT": "Stato del sistema",
    "es-ES": "Estado del sistema",
    "sk-SK": "Stav systému",
    "en-GLOBAL": "System health",
  },
  description: {
    "en-US":
      "Review unresolved errors, failing scheduled tasks and connected instance health.",
    "de-DE":
      "Prüfen Sie offene Fehler, fehlgeschlagene Aufgaben und verbundene Instanzen.",
    "pl-PL":
      "Sprawdź otwarte błędy, nieudane zadania i stan połączonych instancji.",
    "fr-FR":
      "Consultez les erreurs ouvertes, les tâches en échec et l’état des instances connectées.",
    "it-IT":
      "Controlla gli errori aperti, le attività non riuscite e le istanze connesse.",
    "es-ES":
      "Consulta los errores abiertos, las tareas fallidas y el estado de las instancias conectadas.",
    "sk-SK":
      "Skontrolujte otvorené chyby, neúspešné naplánované úlohy a stav pripojených inštancií.",
    "en-GLOBAL":
      "Review unresolved errors, failing scheduled tasks and connected instance health.",
  },
  group: "system",
  icon: "activity",
  order: 1,
  adminPathPrefixes: [
    "vibe/logger/error-monitor",
    "vibe/tasks/watchdog",
    "vibe/platforms/web/health",
    "vibe/server/guard",
  ],
  landing: {
    summary: { alias: "operations-summary", scope: "platform" },
    destinations: [
      "task-health",
      "error-logs",
      "remote-connections",
      "cluster-status",
    ],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "task-health",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
