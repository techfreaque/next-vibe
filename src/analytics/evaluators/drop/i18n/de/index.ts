import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Starker Einbruch",
    titleShort: "Einbruch",
    description:
      "Feuert, wenn ein Wert deutlich unter seinen eigenen gleitenden Durchschnitt fällt",
    fields: {
      source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu bewertender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      window: {
        label: "Vorherige Balken",
        description: "Wie viele vorherige Balken den Basisdurchschnitt bilden",
      },
      dropPct: {
        label: "Einbruch",
        description: "Feuert unter Basis × (1 − Einbruch). 0,5 = 50 % Einbruch",
      },
      minBaseline: {
        label: "Mindestbasis",
        description: "Balken mit kleinerer Basis ignorieren (zu wenig Daten)",
      },
      signals: { label: "Signale", description: "Ausgabe-Signalereignisse" },
    },
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Auswerten",
      loadingText: "Wird ausgewertet…",
    },
    success: {
      title: "Einbruch ausgewertet",
      description: "Signalereignisse zurückgegeben",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Auswertung fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Zuerst Änderungen speichern",
      },
    },
  },
};
