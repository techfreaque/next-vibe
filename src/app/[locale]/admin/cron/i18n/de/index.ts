// Parent aggregator for cron translations
// Imports from co-located child directory i18n folders
import { translations as historyTranslations } from "../../history/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import { translations as taskTranslations } from "../../task/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  history: historyTranslations,
  stats: statsTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  // Shared cron-level translations (German)
  taskManagement: "Aufgabenverwaltung",
  taskDetails: {
    edit: "Aufgabe bearbeiten",
    editDescription: "Aufgabenkonfiguration und -einstellungen ändern",
    back: "Zurück",
    info: "Aufgabeninformationen",
    id: "Aufgaben-ID",
    version: "Version",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    scheduling: "Zeitplanung",
    basicInfo: "Grundinformationen",
    basicInfoDescription: "Basis-Aufgabeneinstellungen konfigurieren",
    name: "Aufgabenname",
    namePlaceholder: "Aufgabenname eingeben",
    description: "Beschreibung",
    descriptionPlaceholder: "Aufgabenbeschreibung eingeben",
    schedulingDescription:
      "Konfigurieren Sie wann und wie oft die Aufgabe läuft",
    schedulePlaceholder: "Cron-Zeitplan auswählen oder eingeben",
    searchSchedule: "Zeitpläne durchsuchen...",
    configuration: "Konfiguration",
    configurationDescription: "Erweiterte Aufgabenkonfigurationsoptionen",
    customBadge: "Benutzerdefiniert",
    noSchedulesFound: "Keine Zeitpläne gefunden",
    useCustomSchedule: "Benutzerdefinierten Zeitplan verwenden",
    commonSchedules: "Häufige Zeitpläne",
  },
  nav: {
    status: "Status",
    status_description: "Überwachen Sie den Systemstatus und aktive Aufgaben",
    stats: "Statistiken",
    stats_description:
      "Zeigen Sie Statistiken und Leistungsmetriken für Cron-Aufgaben an",
    tasks: "Aufgaben",
    tasks_description: "Verwalten und konfigurieren Sie Cron-Aufgaben",
    history: "Verlauf",
    history_description:
      "Zeigen Sie den Ausführungsverlauf von Cron-Aufgaben an",
  },
  buttons: {
    previous: "Zurück",
    next: "Weiter",
    createTask: "Aufgabe erstellen",
    confirmDelete: "Möchten Sie diese Aufgabe wirklich löschen?",
  },
  table: {
    name: "Name",
    schedule: "Zeitplan",
    status: "Status",
    lastExecuted: "Zuletzt ausgeführt",
    nextExecution: "Nächste Ausführung",
    enabled: "Aktiviert",
    actions: "Aktionen",
    statusBadge: {
      disabled: "Deaktiviert",
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      pending: "Ausstehend",
      cancelled: "Abgebrochen",
      blocked: "Blockiert",
      unknown: "Unbekannt",
      never: "Nie",
      notScheduled: "Nicht geplant",
      error: "Fehler",
    },
  },
  executionHistory: {
    titleWithCount: "Ausführungsverlauf ({{count}})",
    pagination: "Zeige {{from}} bis {{to}} von {{total}}",
    errorType: "Fehlertyp",
  },
  cronErrors: {
    admin: {
      interface: {
        noResults: "Keine Ergebnisse",
        filter: "Filter",
        clear: "Löschen",
        schedulePreview: "Zeitplan-Vorschau",
        executionHistory: {
          searchPlaceholder: "Nach Aufgabenname suchen...",
          statusFilter: "Nach Status filtern",
          startDate: "Startdatum",
          endDate: "Enddatum",
          loadingHistory: "Ausführungsverlauf wird geladen...",
          noHistory: "Kein Ausführungsverlauf gefunden",
          started: "Gestartet",
          duration: "Dauer",
          completed: "Abgeschlossen",
          errorDetails: "Fehlerdetails",
        },
      },
    },
  },
  createTask: {
    title: "Neue Aufgabe erstellen",
    description: "Konfigurieren Sie eine neue geplante Aufgabe",
    form: {
      taskName: "Aufgabenname",
      taskNameDescription:
        "Geben Sie einen beschreibenden Namen für diese Aufgabe ein",
      taskNamePlaceholder: "Wert eingeben...",
      priority: "Priorität",
      description: "Beschreibung",
      descriptionPlaceholder: "Aufgabenbeschreibung eingeben...",
      schedule: "Zeitplan",
      scheduleDescription: "Cron-Ausdruck (z.B. 0 0 * * *)",
      enabled: "Aktiviert",
      enabledDescription: "Aktivieren oder deaktivieren Sie diese Aufgabe",
      timeout: "Timeout (ms)",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung (ms)",
      cancel: "Abbrechen",
      creating: "Erstellen...",
      create: "Aufgabe erstellen",
    },
    priorities: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      critical: "Kritisch",
    },
  },
};
