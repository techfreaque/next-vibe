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
    "hi-IN": "सिस्टम हेल्थ",
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
    "hi-IN": "अनसुलझे एरर, फ़ेल होते शेड्यूल टास्क और कनेक्टेड इंस्टेंस की हेल्थ देखें।",
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
      "error-logs",
      "task-health",
      "health",
      "remote-connections",
      "task-budget-caps",
    ],
    destinationDescriptions: {
      "error-logs": {
        "en-US": "Unresolved errors with counts, trend and affected users.",
        "en-GLOBAL": "Unresolved errors with counts, trend and affected users.",
        "de-DE": "Offene Fehler mit Anzahl, Verlauf und betroffenen Nutzern.",
        "pl-PL":
          "Nierozwiązane błędy z liczbą, trendem i dotkniętymi użytkownikami.",
        "fr-FR":
          "Erreurs non résolues avec volume, tendance et utilisateurs touchés.",
        "it-IT": "Errori aperti con conteggi, andamento e utenti coinvolti.",
        "es-ES":
          "Errores sin resolver con recuento, tendencia y usuarios afectados.",
        "sk-SK":
          "Nevyriešené chyby s počtom, trendom a dotknutými používateľmi.",
        "hi-IN": "अनसुलझे एरर, गिनती, ट्रेंड और प्रभावित यूज़र के साथ।",
      },
      "task-health": {
        "en-US": "Running tasks, recent failures and open incidents.",
        "en-GLOBAL": "Running tasks, recent failures and open incidents.",
        "de-DE": "Laufende Aufgaben, letzte Fehlschläge und offene Vorfälle.",
        "pl-PL": "Trwające zadania, ostatnie awarie i otwarte incydenty.",
        "fr-FR": "Tâches en cours, échecs récents et incidents ouverts.",
        "it-IT": "Attività in corso, errori recenti e incidenti aperti.",
        "es-ES": "Tareas en curso, fallos recientes e incidentes abiertos.",
        "sk-SK": "Bežiace úlohy, posledné zlyhania a otvorené incidenty.",
        "hi-IN": "चल रहे टास्क, हाल के फ़ेलियर और खुली घटनाएँ।",
      },
      health: {
        "en-US": "Server status and diagnostics right now.",
        "en-GLOBAL": "Server status and diagnostics right now.",
        "de-DE": "Aktueller Serverstatus und Diagnose.",
        "pl-PL": "Bieżący stan serwera i diagnostyka.",
        "fr-FR": "État du serveur et diagnostic en temps réel.",
        "it-IT": "Stato del server e diagnostica in tempo reale.",
        "es-ES": "Estado del servidor y diagnóstico en tiempo real.",
        "sk-SK": "Aktuálny stav servera a diagnostika.",
        "hi-IN": "अभी का सर्वर स्टेटस और डायग्नॉस्टिक्स।",
      },
      "remote-connections": {
        "en-US": "Linked instances and the health of each connection.",
        "en-GLOBAL": "Linked instances and the health of each connection.",
        "de-DE": "Verbundene Instanzen und der Zustand jeder Verbindung.",
        "pl-PL": "Połączone instancje i stan każdego połączenia.",
        "fr-FR": "Instances liées et état de chaque connexion.",
        "it-IT": "Istanze collegate e stato di ogni connessione.",
        "es-ES": "Instancias vinculadas y el estado de cada conexión.",
        "sk-SK": "Prepojené inštancie a stav každého pripojenia.",
        "hi-IN": "जुड़े इंस्टेंस और हर कनेक्शन की हेल्थ।",
      },
      "task-budget-caps": {
        "en-US": "Credit limits that stop runaway background tasks.",
        "en-GLOBAL": "Credit limits that stop runaway background tasks.",
        "de-DE": "Credit-Limits, die ausufernde Hintergrundaufgaben stoppen.",
        "pl-PL": "Limity kredytów zatrzymujące niekontrolowane zadania w tle.",
        "fr-FR":
          "Plafonds de crédits qui arrêtent les tâches de fond incontrôlées.",
        "it-IT":
          "Limiti di crediti che fermano le attività in background fuori controllo.",
        "es-ES":
          "Límites de créditos que detienen tareas en segundo plano descontroladas.",
        "sk-SK":
          "Limity kreditov, ktoré zastavia nekontrolované úlohy na pozadí.",
        "hi-IN": "क्रेडिट लिमिट जो बेकाबू बैकग्राउंड टास्क रोकती हैं।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "task-health",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
