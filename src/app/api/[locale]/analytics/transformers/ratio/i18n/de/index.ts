import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Verhältnis",
    description:
      "Verhältnis - dividiert Reihe A durch Reihe B, zeitlich ausgerichtet",
    fields: {
      a: { label: "Zähler (A)", description: "Dividenden-Zeitreihe" },
      b: { label: "Nenner (B)", description: "Divisor-Zeitreihe" },
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart für Warm-up",
      },
      result: {
        label: "Verhältnis",
        description: "Ausgabe-Zeitreihe (A / B)",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Verhältnis berechnet",
      description: "Verhältnisreihe zurückgegeben",
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
        description: "Verhältnisberechnung fehlgeschlagen",
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
