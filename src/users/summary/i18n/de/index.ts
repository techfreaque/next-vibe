import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Prüfe Zeitraum und Daten",
    },
    unauthorized: {
      title: "Anmeldung nötig",
      description: "Melde dich an, um Statistiken zu sehen",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Dafür brauchst du die Admin-Rolle",
    },
    notFound: {
      title: "Keine Daten",
      description: "Für diesen Zeitraum gibt es nichts",
    },
    server: {
      title: "Statistik fehlgeschlagen",
      description: "Der Server konnte die Nutzerstatistik nicht berechnen",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Bei der Berechnung ist etwas schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Anfrage widerspricht den aktuellen Daten",
    },
  },
  title: "Kontoübersicht",
  description:
    "Prüfen Sie neue Kundenkonten und deren E-Mail-Bestätigung. Personal- und Testkonten sind ausgenommen.",
  accounts: "Kundenkonten",
  signups: "Neu in 7 Tagen",
  verified: "E-Mail bestätigt",
  unverified: "E-Mail unbestätigt",
  reviewUnverified: "Neue unbestätigte Konten ({{count}})",
  attention: "Zur Prüfung",
  clear: "Alle neuen Konten haben ihre E-Mail-Adresse bestätigt.",
  unavailable: "Bestätigungsstatus nicht verfügbar.",
  recent: "Letzte Aktivitäten",
  loading: "Kontoübersicht wird geladen…",
};
