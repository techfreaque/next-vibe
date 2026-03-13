import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Fenster-Durchschnitt",
    description:
      "Gleitender Fensterdurchschnitt — glättet Werte über ein festes Fenster",
    fields: {
      source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      size: {
        label: "Fenstergröße",
        description: "Anzahl der Perioden im gleitenden Fenster (1–500)",
      },
      result: {
        label: "Fenster-Durchschnitt",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Fenster-Durchschnitt berechnet",
      description: "Fensterdurchschnitts-Reihe zurückgegeben",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Fenster-Durchschnitts-Berechnung fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
