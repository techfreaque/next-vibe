import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Stand: {{date}}",
  reviewErrors: "Fehler prüfen",
  reviewTasks: "Fehlgeschlagene Aufgaben prüfen",
  reviewConnections: "Verbindungen prüfen",
  title: "Betriebsübersicht",
  description:
    "Prüfen Sie offene Fehler, fehlgeschlagene Aufgaben und verbundene Instanzen.",
  errors: "Offene Fehler",
  tasks: "Fehlgeschlagene Aufgaben",
  connections: "Gestörte Verbindungen",
  errorAlert: "Offene Fehlergruppen ({{count}})",
  taskAlert: "Fehlgeschlagene geplante Aufgaben ({{count}})",
  connectionAlert: "Verbindungen mit Handlungsbedarf ({{count}})",
  attention: "Handlungsbedarf",
  clear: "Bei diesen Prüfungen sind keine Probleme offen.",
  unavailable: "Einige Statusprüfungen sind nicht verfügbar.",
  recent: "Letzte Aktivitäten",
  loading: "Systemzustand wird geladen",
  retry: "Erneut versuchen",
};
