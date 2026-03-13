import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    description:
      "Gleitender Durchschnitt Konvergenz Divergenz — trendfolgendes Momentum-Indikator",
    fields: {
      source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      fastPeriod: {
        label: "Schnelle Periode",
        description: "Schnelle EMA-Periode (1–100)",
      },
      slowPeriod: {
        label: "Langsame Periode",
        description: "Langsame EMA-Periode (1–200)",
      },
      signalPeriod: {
        label: "Signalperiode",
        description: "Signal-EMA-Periode (1–50)",
      },
      macd: {
        label: "MACD",
        description: "MACD-Linie (schnelle EMA − langsame EMA)",
      },
      signal: {
        label: "Signal",
        description: "Signallinie (EMA der MACD-Linie)",
      },
      histogram: {
        label: "Histogramm",
        description: "Histogramm (MACD − Signal)",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "MACD berechnet",
      description: "MACD-, Signal- und Histogramm-Reihen zurückgegeben",
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
        description: "MACD-Berechnung fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
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
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
