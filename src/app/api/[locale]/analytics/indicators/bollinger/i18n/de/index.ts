import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bollinger Bänder",
    description:
      "Bollinger Bänder — oberes, mittleres (SMA) und unteres Band mit Standardabweichung",
    fields: {
      source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      period: {
        label: "Periode",
        description: "Anzahl der Perioden (2–200)",
      },
      stdDev: {
        label: "Standardabweichungs-Multiplikator",
        description: "Standardabweichungs-Multiplikator (0,1–5)",
      },
      upper: {
        label: "Oberes Band",
        description: "Oberes Bollinger-Band Zeitreihe",
      },
      middle: {
        label: "Mittleres Band",
        description: "Mittleres Band (SMA) Zeitreihe",
      },
      lower: {
        label: "Unteres Band",
        description: "Unteres Bollinger-Band Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Bollinger Bänder berechnet",
      description: "Oberes, mittleres und unteres Band zurückgegeben",
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
        description: "Bollinger-Bänder-Berechnung fehlgeschlagen",
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
