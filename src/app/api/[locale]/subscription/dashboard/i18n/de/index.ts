import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Abonnement-Übersicht",
    titleShort: "Dashboard",
    description: "Dein Abonnement auf einen Blick",
    errors: {
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Bitte melde dich an, um dein Abonnement zu sehen",
      },
      validation: {
        title: "Ungültige Eingabe",
        description: "Ungültige Parameter",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Du hast keine Berechtigung, dies anzusehen",
      },
      server: {
        title: "Serverfehler",
        description: "Abonnementdaten konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Etwas Unerwartetes ist passiert",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Verbindungsfehler",
        description: "Überprüfe deine Internetverbindung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Abonnement gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Geladen",
      description: "Abonnementdaten geladen",
    },
    response: {
      activeCount: "Aktiv",
      cancelingCount: "Wird gekündigt",
      trialCount: "Testphase",
      totalCount: "Gesamt",
    },
  },
  widget: {
    actions: "Schnellzugriff",
    mySubscription: "Mein Abonnement",
    manage: "Verwalten",
    refresh: "Aktualisieren",
    noData: "Keine Abonnementdaten verfügbar",
  },
};
