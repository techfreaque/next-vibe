import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "instances",
  label: {
    "en-US": "Connected instances",
    "de-DE": "Verbundene Instanzen",
    "pl-PL": "Połączone instancje",
    "fr-FR": "Instances connectées",
    "it-IT": "Istanze collegate",
    "es-ES": "Instancias conectadas",
    "sk-SK": "Pripojené inštancie",
    "en-GLOBAL": "Connected instances",
  },
  description: {
    "en-US": "Review connected instances and their connection status.",
    "en-GLOBAL": "Review connected instances and their connection status.",
    "de-DE": "Prüfen Sie verbundene Instanzen und deren Verbindungsstatus.",
    "pl-PL": "Sprawdź połączone instancje i stan połączeń.",
    "fr-FR": "Consultez les instances associées et l’état de leur connexion.",
    "it-IT": "Verifichi le istanze collegate e lo stato delle connessioni.",
    "es-ES":
      "Consulte las instancias vinculadas y el estado de sus conexiones.",
    "sk-SK": "Skontrolujte pripojené inštancie a stav ich spojenia.",
  },
  group: "system",
  icon: "network",
  order: 5,
  adminPathPrefixes: ["vibe/remote-connection"],
  landing: {
    summary: {
      alias: "platform-summary",
      scope: "platform",
      args: { section: "instances" },
      progressive: true,
    },
    destinations: ["remote-connections"],
    destinationDescriptions: {
      "remote-connections": {
        "en-US": "Linked instances and the health of each connection.",
        "en-GLOBAL": "Linked instances and the health of each connection.",
        "de-DE": "Verbundene Instanzen und der Zustand jeder Verbindung.",
        "pl-PL": "Połączone instancje i stan każdego połączenia.",
        "fr-FR": "Instances liées et état de chaque connexion.",
        "it-IT": "Istanze collegate e stato di ogni connessione.",
        "es-ES": "Instancias vinculadas y el estado de cada conexión.",
        "sk-SK": "Prepojené inštancie a stav každého pripojenia.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "remote-connections",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
