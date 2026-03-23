import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Delta",
    description:
      "Differenz zwischen aufeinanderfolgenden Werten - misst die Änderungsrate",
    fields: {
      source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      result: { label: "Delta", description: "Ausgabe-Zeitreihe" },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Delta berechnet",
      description: "Delta-Reihe zurückgegeben",
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
        description: "Delta-Berechnung fehlgeschlagen",
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
